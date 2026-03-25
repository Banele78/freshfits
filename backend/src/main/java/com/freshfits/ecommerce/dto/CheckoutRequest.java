package com.freshfits.ecommerce.dto;

import java.math.BigDecimal;

import com.freshfits.ecommerce.entity.Order.DeliveryMethod;

import lombok.Data;

@Data
public class CheckoutRequest {
   
    private Long addressId; // ID of the shipping address
    private DeliveryMethod deliveryMethod; // e.g., "CREDIT_CARD", "PAYPAL", etc.
    private BigDecimal deliveryFee; // e.g., "STANDARD", "EXPRESS", "PICKUP"
  
} 
