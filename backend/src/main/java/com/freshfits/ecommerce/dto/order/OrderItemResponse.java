package com.freshfits.ecommerce.dto.order;

import java.math.BigDecimal;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemResponse {
    private Long productId; 
    private String name; 
    private String slug; 
    private Integer quantity; 
    private BigDecimal price; 
    private String imageUrl;
    private String size;
}
