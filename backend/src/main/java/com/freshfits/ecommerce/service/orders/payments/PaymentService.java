package com.freshfits.ecommerce.service.orders.payments;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.OptimisticLockingFailureException;

import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.freshfits.ecommerce.entity.Order;
import com.freshfits.ecommerce.entity.OrderItem;

import com.freshfits.ecommerce.entity.ProductsSizes;
import com.freshfits.ecommerce.repository.OrderRepository;

import com.freshfits.ecommerce.repository.ProductsSizesRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final OrderRepository orderRepository;
    private final ProductsSizesRepository productsSizesRepository;

    private final RefundService refundService;
    private final HandlePaymentService handlePaymentService;

   

     @Transactional
@Retryable(
        retryFor = OptimisticLockingFailureException.class,
        maxAttempts = 3,
        backoff = @Backoff(delay = 200)
)
public void handlePaymentWebhookSuccess(Long orderId, BigDecimal amountPaid) {
    Order order = getOrderById(orderId);

    // Validate amount
    BigDecimal total = order.getOrderItems().stream()
            .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    if (amountPaid.compareTo(total) < 0) {
        throw new IllegalArgumentException("Payment amount " + amountPaid + " does not cover order total " + total);
    }

    // Check expiration
    boolean reservationExpired = order.getReservationExpiresAt() != null
        && LocalDateTime.now().isAfter(order.getReservationExpiresAt());


    // Batch fetch products once
    Map<Long, ProductsSizes> productMap = order.getOrderItems().stream()
            .map(OrderItem::getProductSize)
            .map(ProductsSizes::getId)
            .distinct()
            .collect(Collectors.toMap(
                    id -> id,
                    id -> productsSizesRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Product not found"))
            ));

            if (reservationExpired) {
    if (hasSufficientStock(order, productMap)) {
        handlePaymentService.handlePaymentSuccess(order, amountPaid, true, productMap);
        log.info("Order {} expired but stock available — confirmed", orderId);
    } else {
        refundService.triggerRefund(order, amountPaid, "Order expired, insufficient stock");
    }
} else {
    handlePaymentService.handlePaymentSuccess(order, amountPaid, false, productMap);
}
 
}


/**
 * Check if there is enough *available* stock for all items in the order.
 * Accepts pre-fetched productMap to avoid duplicate DB calls
 */
private boolean hasSufficientStock(Order order, Map<Long, ProductsSizes> productMap) {
    return order.getOrderItems().stream().allMatch(item -> {
        ProductsSizes ps = productMap.get(item.getProductSize().getId());
        int available = ps.getStockQuantity() - ps.getReservedQuantity();
        return available >= item.getQuantity();
    });
}

     @Transactional
      @Retryable(
        retryFor = Exception.class,
        maxAttempts = 3,
        backoff = @Backoff(delay = 2000)
    )
   public void handleRefundSucceeded(Long orderId, String reason) {
      refundService.handleRefundSucceeded(orderId, reason);
    }


     @Transactional
      @Retryable(
        retryFor = Exception.class,
        maxAttempts = 3,
        backoff = @Backoff(delay = 2000)
    )
    public void handleRefundFailed(Long orderId, String reason) {
        refundService.handleRefundFailed(orderId, reason);
     }


    
    

  @Transactional
@Retryable(
        retryFor = OptimisticLockingFailureException.class,
        maxAttempts = 3,
        backoff = @Backoff(delay = 200)
)
public void handlePaymentFailure(Long orderId, BigDecimal amountFailed) {
    Order order = getOrderById(orderId);

    // Check if order is pending
    if (!Order.OrderStatus.PENDING.equals(order.getStatus())) {
        log.warn("Order {} is not pending (status={}), ignoring failure webhook", orderId, order.getStatus());
        return;
    }

    // Check if order has expired
    if (order.getReservationExpiresAt() != null && order.getReservationExpiresAt().isBefore(LocalDateTime.now())) {
        log.info("Order {} has expired — skipping failure handling", orderId);
        return;
    }

    // Batch fetch products once
    Map<Long, ProductsSizes> productMap = order.getOrderItems().stream()
            .map(OrderItem::getProductSize)
            .map(ProductsSizes::getId)
            .distinct()
            .collect(Collectors.toMap(
                    id -> id,
                    id -> productsSizesRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Product not found"))
            ));

    // Roll back reserved quantities
    order.getOrderItems().forEach(item -> {
        ProductsSizes ps = productMap.get(item.getProductSize().getId());
        ps.setReservedQuantity(Math.max(0, ps.getReservedQuantity() - item.getQuantity()));
    });

    productsSizesRepository.saveAll(productMap.values());

    // Update order status
    order.setStatus(Order.OrderStatus.CANCELLED);
    order.setUpdatedAt(LocalDateTime.now());
    order.setReserved(false);
    orderRepository.save(order);

    log.warn("Payment failed for order {} — reserved quantities rolled back, amount {}", orderId, amountFailed);
}


    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}

