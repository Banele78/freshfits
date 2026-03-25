package com.freshfits.ecommerce.dto.order;

import lombok.Data;

@Data
public class YocoPaymentRequest {
    private String token;
    private Long orderId;
}

