package com.freshfits.ecommerce.service.orders.payments;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.freshfits.ecommerce.dto.order.YocoPaymentRequest;
import com.freshfits.ecommerce.entity.Order;
import com.freshfits.ecommerce.repository.OrderRepository;
import com.freshfits.ecommerce.service.orders.OrderService;
import com.freshfits.ecommerce.service.orders.ReleaseService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class YocoPaymentService {

    private final OrderService orderService;

    @Value("${yoco.api.secret-key}")
    private String secretKey;

    private final OrderRepository orderRepository;
    private final ReleaseService  releaseService;
    private final RestTemplate restTemplate = new RestTemplate();

   

    @Transactional
    public void processPayment(Long userId, YocoPaymentRequest request) {

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // ✅ Ownership check
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized order access");
        }

        // ✅ Reservation check
        if (!order.isReserved() ||
            order.getReservationExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Order reservation expired");
        }

        // ✅ Prevent double payment
        if (order.getStatus() == Order.OrderStatus.PAID) {
            throw new RuntimeException("Order already paid");
        }

        long amountInCents =
                order.getTotalAmount()
                     .multiply(BigDecimal.valueOf(100))
                     .longValue();

        chargeYoco(request.getToken(), amountInCents, order);

       
        orderRepository.save(order);
    }

   private void chargeYoco(String token, long amountInCents, Order order) {

    String url = "https://payments.yoco.com/api/charges";

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(secretKey);

    JSONObject body = new JSONObject();
    body.put("token", token);
    body.put("amount", amountInCents);
    body.put("currency", "ZAR");
    body.put("metadata", Map.of(
            "order_id", order.getId().toString()
    ));

    HttpEntity<String> entity = new HttpEntity<>(body.toString(), headers);

    try {
        ResponseEntity<String> response =
                restTemplate.postForEntity(url, entity, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Charge rejected");
        }

    } catch (Exception e) {
        releaseService.releaseReservation(order.getId());
        throw new RuntimeException("Yoco payment error");
    }
}


}


