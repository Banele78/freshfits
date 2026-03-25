package com.freshfits.ecommerce.dto.cart;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CartItemDTO {
    private Long productId;
    private String productName;
    private String imageUrl; // ✅ Added image URL
    private String slug; // ✅ Added slug for product links
    private int quantity;
    private BigDecimal totalPrice;
    private LocalDateTime addedAt;
    private BigDecimal unitPrice;
    private String lowStockMessage;
    private String size; // ✅ Added size name
    private Long productSizeId; // ✅ Added size ID for updates/removal
    private boolean outOfStock;
    private boolean exceedsStock;
    private Integer availableStock;
    private String stockMessage;
}