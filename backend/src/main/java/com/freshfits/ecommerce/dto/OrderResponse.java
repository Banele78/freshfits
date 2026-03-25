package com.freshfits.ecommerce.dto;

import java.util.List;


import com.freshfits.ecommerce.dto.order.UnavailableItem;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class OrderResponse {
    
    private boolean success;
    private String message;
    private Long orderId;
    private List<UnavailableItem> unavailableProducts;


}

