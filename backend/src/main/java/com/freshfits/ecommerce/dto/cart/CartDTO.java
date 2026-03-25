package com.freshfits.ecommerce.dto.cart;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CartDTO {
    private List<CartItemDTO> items;
    private BigDecimal totalPrice;
    private int totalItems; // ✅ Added total items count
    private boolean hasLowStockItems; // ✅ Added flag for UI
}