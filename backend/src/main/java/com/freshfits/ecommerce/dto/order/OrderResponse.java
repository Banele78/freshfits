package com.freshfits.ecommerce.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.freshfits.ecommerce.entity.Order;
import com.freshfits.ecommerce.entity.Order.DeliveryMethod;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private String orderNumber; 
    private BigDecimal totalAmount;
    private BigDecimal deliveryFee;
    private BigDecimal subtotalAmount;
    private List<OrderItemResponse> items; 
    private ShippingAddressResponse shippingAddress;
    private Order.OrderStatus status;
    private LocalDateTime createdAt;
    private String yocoCheckoutUrl;
    private int totalItemsCount; // add getter/setter or @Builder
    private DeliveryMethod deliveryMethod;
    private LocalDateTime deliveryDate;

}
