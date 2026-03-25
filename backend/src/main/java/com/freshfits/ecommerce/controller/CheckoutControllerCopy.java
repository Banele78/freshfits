package com.freshfits.ecommerce.controller;

import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.*;


import com.freshfits.ecommerce.dto.CheckoutRequest;

import com.freshfits.ecommerce.dto.OrderResponse;
import com.freshfits.ecommerce.jwt.JwtUserPrincipal;
import com.freshfits.ecommerce.service.orders.create.CreateOrderService;


@RestController
@RequestMapping("/api/chec")
public class CheckoutControllerCopy {

    private final CreateOrderService createOrderService;

    public CheckoutControllerCopy(CreateOrderService createOrderService) {
        this.createOrderService = createOrderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> checkout(
           @AuthenticationPrincipal JwtUserPrincipal principal,
            @RequestBody CheckoutRequest request) {

        OrderResponse orderResponse;

        try {
            orderResponse = createOrderService.createOrder(
                    principal.id(),
                    request
            );
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(OrderResponse.builder()
                            .success(false)
                            .message(ex.getMessage())
                            .build());
        }

        if (!orderResponse.isSuccess()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(orderResponse);
        }

        return ResponseEntity.ok(orderResponse);
    }
}
