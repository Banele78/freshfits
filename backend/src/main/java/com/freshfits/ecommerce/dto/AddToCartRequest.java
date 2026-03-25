package com.freshfits.ecommerce.dto;

import lombok.Data;

@Data
public class AddToCartRequest {
    
   
    private Long productSizeId;
    private int quantity;
    private String action;
}
