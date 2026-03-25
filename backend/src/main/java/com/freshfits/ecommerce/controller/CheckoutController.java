package com.freshfits.ecommerce.controller;

import com.freshfits.ecommerce.dto.CheckoutRequest;
import com.freshfits.ecommerce.dto.CheckoutResponse;
import com.freshfits.ecommerce.dto.OrderResponse;
import com.freshfits.ecommerce.entity.Order;
import com.freshfits.ecommerce.entity.OrderItem;
import com.freshfits.ecommerce.entity.YocoCheckouts;
import com.freshfits.ecommerce.jwt.JwtUserPrincipal;
import com.freshfits.ecommerce.repository.YocoCheckoutsRepository;
import com.freshfits.ecommerce.service.orders.OrderService;
import com.freshfits.ecommerce.service.orders.ReleaseService;
import com.freshfits.ecommerce.service.orders.create.CreateOrderService;

import org.json.JSONArray;
import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private static final Logger log = LoggerFactory.getLogger(CheckoutController.class);

    private final OrderService orderService;
    private final CreateOrderService createOrderService;
    private final ReleaseService releaseService;
 
    private final YocoCheckoutsRepository yocoCheckoutsRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${yoco.api.secret-key}")
    private String secretKey;
    
     @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;
    

    public CheckoutController(OrderService orderService , 
                              CreateOrderService createOrderService,
                              ReleaseService releaseService,
                              YocoCheckoutsRepository yocoCheckoutsRepository) {
        this.orderService = orderService;
        this.createOrderService = createOrderService;
        this.yocoCheckoutsRepository = yocoCheckoutsRepository;
        this.releaseService = releaseService;
    }

   @PostMapping
public ResponseEntity<CheckoutResponse> checkout(
       @AuthenticationPrincipal JwtUserPrincipal principal,
        @RequestBody CheckoutRequest request) {

    OrderResponse orderResponse;
    
        // Delegate order creation + stock checks
       orderResponse = createOrderService.createOrder(
                    principal.id(),
                    request
            );
   if (!orderResponse.isSuccess()) {
    HttpStatus status = HttpStatus.BAD_REQUEST; // default

    if (orderResponse.getUnavailableProducts() != null &&
        !orderResponse.getUnavailableProducts().isEmpty()) {
        status = HttpStatus.CONFLICT; // 409 for stock unavailable
    }

    return ResponseEntity.status(status)
            .body(new CheckoutResponse(orderResponse, null));
}


    // ✅ Stop if order creation failed
    if (!orderResponse.isSuccess()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new CheckoutResponse(orderResponse, null));
    }

    Long orderId = orderResponse.getOrderId();
    Order order = orderService.getOrderById(orderId);

    // ✅ Check if reservation is still valid
    if (!order.isReserved() || order.getReservationExpiresAt().isBefore(LocalDateTime.now())) {
        // Release stock immediately
        releaseService.releaseReservation(order.getId());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new CheckoutResponse(orderResponse, null));
    }

    // Build Yoco request
    String url = "https://payments.yoco.com/api/checkouts";
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Authorization", "Bearer " + secretKey);

    Long amountInCents = order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue();

    JSONObject body = new JSONObject();
    body.put("amount", amountInCents);
    body.put("currency", "ZAR");
    body.put("successUrl", frontendUrl + "/account/order/" + order.getOrderNumber());
    body.put("cancelUrl", frontendUrl + "/account/order/" + order.getOrderNumber());
    body.put("failureUrl", frontendUrl + "/account/order/" + order.getOrderNumber());

    // Metadata for reconciliation
    JSONObject metadata = new JSONObject();
    metadata.put("order_id", order.getId());
    metadata.put("customer_email", principal.email());
    body.put("metadata", metadata);

    // ✅ Add line items in Yoco’s format
    JSONArray lineItems = new JSONArray();
    BigDecimal subtotal = BigDecimal.ZERO;

    for (OrderItem item : order.getOrderItems()) {
        JSONObject lineItem = new JSONObject();
        lineItem.put("displayName", item.getProductSize().getProduct().getName());
        lineItem.put("quantity", item.getQuantity());

        JSONObject pricingDetails = new JSONObject();
        pricingDetails.put("price", item.getUnitPrice().multiply(BigDecimal.valueOf(100)).longValue()); // cents
        lineItem.put("pricingDetails", pricingDetails);

        lineItem.put("description", item.getProductSize().getProduct().getDescription()); // optional
        subtotal = subtotal.add(item.getPrice());

        lineItems.put(lineItem);
    }

    // Add delivery as line item if > 0
if (order.getDeliveryFee() != null 
    && order.getDeliveryFee().compareTo(BigDecimal.ZERO) > 0) {

    JSONObject deliveryItem = new JSONObject();
    deliveryItem.put("displayName", "Delivery Fee");
    deliveryItem.put("quantity", 1);

    JSONObject pricingDetails = new JSONObject();
    pricingDetails.put("price", order.getDeliveryFee()
            .multiply(BigDecimal.valueOf(100))
            .longValue());

    deliveryItem.put("pricingDetails", pricingDetails);

    lineItems.put(deliveryItem);
}


    body.put("subtotalAmount", subtotal.multiply(BigDecimal.valueOf(100)).longValue());
    body.put("totalTaxAmount", 0);     // calculate tax if applicable
    body.put("totalDiscount", 0);      // apply discounts if any
    body.put("lineItems", lineItems);

    HttpEntity<String> entity = new HttpEntity<>(body.toString(), headers);

    try {
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        JSONObject responseJson = new JSONObject(response.getBody());
        String checkoutId = responseJson.getString("id"); // store Yoco checkout ID
        String checkoutUrl = responseJson.getString("redirectUrl");

        YocoCheckouts yocoCheckout = new YocoCheckouts();
        yocoCheckout.setYocoCheckoutId(checkoutId);
        yocoCheckout.setOrder(order);
        yocoCheckout.setYocoCheckoutUrl(checkoutUrl);
        yocoCheckout.setCreatedAt(LocalDateTime.now());
        yocoCheckout.setIsExpired(false);
        yocoCheckoutsRepository.save(yocoCheckout);

        return ResponseEntity.ok(new CheckoutResponse(orderResponse, checkoutUrl));
    } catch (Exception e) {
        log.error("Yoco checkout creation failed for order {}: {}", order.getId(), e.getMessage(), e);

        // ✅ Release stock if checkout fails
        releaseService.releaseReservation(order.getId());

        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(new CheckoutResponse(orderResponse, null));
    }
}

}
