package com.freshfits.ecommerce.dto.cart;

import java.math.BigDecimal;
import java.time.LocalDateTime;





public interface CartItemDTOProjection {
    Long getProductId();
    Long getProductSizeId();
    String getProductName();
    String getProductSlug();
    String getSizeName();
    Integer getQuantity();
    BigDecimal getUnitPrice();
    Integer getStockQuantity();
    Integer getReservedQuantity();
    LocalDateTime getAddedAt();
    String getPrimaryImageS3Key();
}
