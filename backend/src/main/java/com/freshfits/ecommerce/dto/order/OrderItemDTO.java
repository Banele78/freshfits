package com.freshfits.ecommerce.dto.order;

import java.math.BigDecimal;

public record OrderItemDTO(
        Long orderId,
        Long productId,
        String productName,
        String productSlug,
        Integer quantity,
        BigDecimal price,
        String imageKey,
        String size
) {}
