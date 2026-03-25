package com.freshfits.ecommerce.dto.product;

import java.math.BigDecimal;

public record ProductListDTO(
    Long id,
    String name,
    BigDecimal price,
    String brand,
    String category,
    String department,
    String fitType,
    String slug
) {}
