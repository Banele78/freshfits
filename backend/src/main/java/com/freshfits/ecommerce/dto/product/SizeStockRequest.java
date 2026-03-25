package com.freshfits.ecommerce.dto.product;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SizeStockRequest {
    @NotNull
    private Long sizeId;

    @PositiveOrZero
    private Integer stockQuantity;
}
