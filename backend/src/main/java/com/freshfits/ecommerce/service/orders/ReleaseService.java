package com.freshfits.ecommerce.service.orders;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.freshfits.ecommerce.dto.order.OrderDTO;
import com.freshfits.ecommerce.dto.order.OrderDTO.OrderItemDTO;
import com.freshfits.ecommerce.entity.*;
import com.freshfits.ecommerce.exception.*;
import com.freshfits.ecommerce.repository.*;

import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;


@Service
@RequiredArgsConstructor
public class ReleaseService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final UserRepository userRepository;
    private final ProductsSizesRepository productsSizesRepository;
    private final OrderRepository orderRepository;


     private final RestTemplate restTemplate = new RestTemplate();

    @Value("${yoco.api.secret-key}")
    private String secretKey;


     /**
     * Bulk, enum-safe, batch-updating reservation release.
     * - Single transaction per call
     * - Loads all needed graph in one go (orderItems + products)
     * - Applies product deltas then saves in batch
     */
  @Transactional
@Retryable(
    retryFor = OptimisticLockingFailureException.class,
    maxAttempts = 3,
    backoff = @Backoff(delay = 200, multiplier = 2)
)
public void releaseReservationsBulk(List<Long> orderIds) {
    if (orderIds == null || orderIds.isEmpty()) {
        log.debug("No order IDs provided for bulk release");
        return;
    }

    // Fetch all orders at once
    final List<Order> orders = orderRepository.findAllById(orderIds);
    if (orders.isEmpty()) {
        log.debug("No orders found for IDs: {}", orderIds);
        return;
    }

    // Only operate on PENDING orders
    final List<Order> pending = orders.stream()
        .filter(o -> Order.OrderStatus.PENDING.equals(o.getStatus()))
        .toList();

    if (pending.isEmpty()) {
        log.debug("No pending orders found in the batch");
        return;
    }

    // Build product size reserved-delta map
    final Map<Long, Integer> reservedDeltaByProductSizeId = new HashMap<>();
    for (Order o : pending) {
        for (OrderItem item : o.getOrderItems()) {
            final Long productSizeId = item.getProductSize().getId();
            // Release = negative delta
            reservedDeltaByProductSizeId.merge(productSizeId, -item.getQuantity(), Integer::sum);
            
        }
        cancelYocoCheckout(o.getYocoCheckout().getYocoCheckoutId());
        o.getYocoCheckout().setIsExpired(true);
    }

    if (reservedDeltaByProductSizeId.isEmpty()) {
        log.warn("No product size deltas to process for pending orders");
        return;
    }

    // Load fresh product size entities for concurrency correctness
    final List<Long> productSizeIds = new ArrayList<>(reservedDeltaByProductSizeId.keySet());
    final Map<Long, ProductsSizes> productSizes = productsSizesRepository.findAllById(productSizeIds)
            .stream()
            .collect(Collectors.toMap(ProductsSizes::getId, ps -> ps));

    // Check for missing product sizes
    if (productSizes.size() != productSizeIds.size()) {
        List<Long> missingIds = productSizeIds.stream()
                .filter(id -> !productSizes.containsKey(id))
                .toList();
        log.warn("Some product sizes not found: {}", missingIds);
    }

    // Apply deltas safely (no negative reserved quantity)
    for (Map.Entry<Long, Integer> entry : reservedDeltaByProductSizeId.entrySet()) {
        final ProductsSizes ps = productSizes.get(entry.getKey());
        if (ps == null) {
            // Product size was not found, skip
            continue;
        }
        final int newReserved = Math.max(0, ps.getReservedQuantity() + entry.getValue());
        ps.setReservedQuantity(newReserved);
        
        // Optional debug logging
        if (log.isDebugEnabled()) {
            log.debug("ProductSize {}: reservedQuantity {} -> {} (delta: {})",
                    ps.getId(), ps.getReservedQuantity() - entry.getValue(), 
                    newReserved, entry.getValue());
        }
    }

    // Batch-save product sizes
    productsSizesRepository.saveAll(productSizes.values());

    // Update orders in batch
    final LocalDateTime now = LocalDateTime.now();
    pending.forEach(o -> {
        o.setStatus(Order.OrderStatus.CANCELLED);
        o.setReserved(false);
        o.setUpdatedAt(now);
    });
    orderRepository.saveAll(pending);

    log.info("Released reservations for {} orders, affecting {} product sizes", 
             pending.size(), productSizes.size());
}

private void cancelYocoCheckout(String checkoutId) {
    if (checkoutId == null) return;

    String url = "https://payments.yoco.com/api/checkouts/" + checkoutId + "/cancel";
    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(secretKey);
    headers.setContentType(MediaType.APPLICATION_JSON);

    HttpEntity<String> entity = new HttpEntity<>("{}", headers);
    try {
        restTemplate.postForEntity(url, entity, String.class);
        log.info("Cancelled Yoco checkout {}", checkoutId);
    } catch (Exception e) {
        log.warn("Failed to cancel Yoco checkout {}: {}", checkoutId, e.getMessage());
    }
}

    @Recover
    public void recoverBulkRelease(OptimisticLockingFailureException ex, List<Long> orderIds) {
        log.error("Bulk release failed after retries for {} orders: {}", 
                  orderIds != null ? orderIds.size() : 0, ex.getMessage(), ex);
        // Optional: enqueue for manual review / DLQ
    }



      /**
     * Release reserved stock — used by scheduler & failure paths.
     */
   @Transactional
@Retryable(
        retryFor = OptimisticLockingFailureException.class,
        maxAttempts = 3,
        backoff = @Backoff(delay = 200)
)
public void releaseReservation(Long orderId) {
    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

    if (!Order.OrderStatus.PENDING.equals(order.getStatus())) return;

    // Batch fetch all product sizes from the order items
    Map<Long, ProductsSizes> productSizeMap = order.getOrderItems().stream()
            .map(OrderItem::getProductSize)
            .map(ProductsSizes::getId)
            .distinct()
            .collect(Collectors.toMap(
                id -> id,
                id -> productsSizesRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Product size not found"))
            ));

    // Decrement reserved quantities for each product size
    order.getOrderItems().forEach(item -> {
        ProductsSizes ps = productSizeMap.get(item.getProductSize().getId());
        ps.setReservedQuantity(Math.max(0, ps.getReservedQuantity() - item.getQuantity()));
    });

    // Save all product sizes in batch
    productsSizesRepository.saveAll(productSizeMap.values());

    // Update order status
    order.setStatus(Order.OrderStatus.CANCELLED);
    order.setReserved(false);
    order.setUpdatedAt(LocalDateTime.now());
    orderRepository.save(order);

    log.info("Reservation released for order {}", orderId);
}

    /**
     * Recover method for retries
     */
    @Recover
    public void recoverFromOptimisticLock(OptimisticLockingFailureException ex, Long orderId) {
        log.error("Failed to process order {} after retries due to concurrency issues: {}", orderId, ex.getMessage());
        // Optional: trigger alert or compensating action
    }

    
}
