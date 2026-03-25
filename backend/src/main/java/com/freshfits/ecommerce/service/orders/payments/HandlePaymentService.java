package com.freshfits.ecommerce.service.orders.payments;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.freshfits.ecommerce.entity.Order;

import com.freshfits.ecommerce.entity.ProductsSizes;
import com.freshfits.ecommerce.repository.OrderRepository;

import com.freshfits.ecommerce.repository.ProductsSizesRepository;
import com.freshfits.ecommerce.service.orders.notification.OrderNotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HandlePaymentService {

    private static final Logger log = LoggerFactory.getLogger(HandlePaymentService.class);

   
    private final OrderRepository orderRepository;
    private final OrderNotificationService orderNotificationService;
    private final ProductsSizesRepository productsSizesRepository;
   

    @Transactional
    public void handlePaymentSuccess(Order order, BigDecimal amountPaid, boolean wasExpiredFlow, Map<Long, ProductsSizes> productMap) {
        // Guard clause
        if (!wasExpiredFlow && order.getStatus() != Order.OrderStatus.PENDING) {
            log.warn("Ignoring payment webhook for order {} with status {}", order.getId(), order.getStatus());
            return;
        }

        // Adjust stock & reserved quantities
        adjustStock(order, productMap, wasExpiredFlow);

        // Update order status
        order.setStatus(Order.OrderStatus.PAID);
        order.setPaidAt(LocalDateTime.now());
        order.setReserved(false);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

       orderNotificationService.sendPaymentSuccessEmail(order);

        log.info("Payment processed successfully for order {}, amount {}, expiredFlow={}",
                 order.getId(), amountPaid, wasExpiredFlow);
    }

    private void adjustStock(Order order, Map<Long, ProductsSizes> productMap, boolean wasExpiredFlow) {
        order.getOrderItems().forEach(item -> {
            ProductsSizes ps = productMap.get(item.getProductSize().getId());
            if (ps == null) {
                throw new IllegalStateException("ProductsSizes not found in productMap: " + item.getProductSize().getId());
            }
            if (!wasExpiredFlow) {
                ps.setReservedQuantity(Math.max(0, ps.getReservedQuantity() - item.getQuantity()));
            }
            ps.setStockQuantity(Math.max(0, ps.getStockQuantity() - item.getQuantity()));
        });
        productsSizesRepository.saveAll(productMap.values());
    }

   
}

