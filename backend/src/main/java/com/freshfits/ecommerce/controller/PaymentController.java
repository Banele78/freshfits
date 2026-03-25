package com.freshfits.ecommerce.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.freshfits.ecommerce.dto.order.YocoPaymentRequest;
import com.freshfits.ecommerce.jwt.JwtUserPrincipal;
import com.freshfits.ecommerce.service.orders.payments.YocoPaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final YocoPaymentService yocoPaymentService;

    @PostMapping("/yoco")
    public ResponseEntity<?> payWithYoco(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @RequestBody YocoPaymentRequest request
    ) {
        try {
            yocoPaymentService.processPayment(
                    principal.id(),
                    request
            );
            return ResponseEntity.ok().build();

        } catch (RuntimeException ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", ex.getMessage()));
        }
    }
}

