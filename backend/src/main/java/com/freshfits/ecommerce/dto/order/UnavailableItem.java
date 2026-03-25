package com.freshfits.ecommerce.dto.order;

public record UnavailableItem(
    Long productSizeId,
    int requested,
    int available
) {}

