package com.freshfits.ecommerce.service.orders.create;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.freshfits.ecommerce.entity.*;
import com.freshfits.ecommerce.entity.Order.DeliveryMethod;
import com.freshfits.ecommerce.repository.*;

import lombok.RequiredArgsConstructor;


import org.springframework.beans.factory.annotation.Value;

@Service
@RequiredArgsConstructor
public class CreateOrderPhaseService {

    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    
    @Value("${reservation.expiryMinutes:15}") // default = 15
    private int reservationMinutes;

    @Transactional
public Order createOrderPhase(User user, Address address, Cart cart, List<CartItem> items , DeliveryMethod deliveryMethodStr, BigDecimal deliveryFee) {

    Order order = new Order();
    order.setUser(user);
    order.setShippingAddress(address);
    order.setStatus(Order.OrderStatus.PENDING);
    order.setReservationExpiresAt(LocalDateTime.now().plusMinutes(reservationMinutes));
    order.setReserved(true);
    order.setDeliveryMethod(deliveryMethodStr);
    order.setDeliveryFee(deliveryFee);
    order.setDeliveryDate(null);    

    List<OrderItem> orderItems = items.stream().map(item -> {
        ProductsSizes ps = item.getProductSize();
        Product product = ps.getProduct();
        BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        OrderItem oi = new OrderItem();
        oi.setOrder(order);
        oi.setProductSize(ps);
        oi.setQuantity(item.getQuantity());
        oi.setUnitPrice(product.getPrice());
        oi.setPrice(lineTotal);
        return oi;
    }).toList();

    BigDecimal subtotal = orderItems.stream()
        .map(OrderItem::getPrice)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal finalTotal = subtotal.add(
        deliveryFee != null ? deliveryFee : BigDecimal.ZERO
      );

    order.setOrderItems(orderItems);
    order.setTotalAmount(finalTotal);
    order.setSubtotalAmount(subtotal);

    orderRepository.save(order);

    cartItemRepository.deleteByCartId(cart.getId());

    return order;
}

    
    
}
