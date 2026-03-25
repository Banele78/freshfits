package com.freshfits.ecommerce.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.freshfits.ecommerce.entity.Address.AddressType;
import com.freshfits.ecommerce.entity.Order;
import com.freshfits.ecommerce.entity.Order.DeliveryMethod;

public record OrderSummaryDTO(
        Long id,
        String orderNumber,
        BigDecimal totalAmount,
        Order.OrderStatus status,
        LocalDateTime createdAt,
        DeliveryMethod deliveryMethod,
        BigDecimal deliveryFee,
        LocalDateTime deliveryDate,
        BigDecimal subtotalAmount,
        Long addressId,
        String addressLine1,
        String addressLine2,
        String city,
        String province,
        String postalCode,
        String country,
        String phoneNo,
        String name,
        String surname,
        String companyName,
        AddressType addressType,
        String yocoCheckoutUrl
) {}

