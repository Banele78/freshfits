package com.freshfits.ecommerce.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.freshfits.ecommerce.dto.order.OrderDTO;
import com.freshfits.ecommerce.dto.order.OrderResponse;
import com.freshfits.ecommerce.dto.order.PaginatedOrderResponse;
import com.freshfits.ecommerce.jwt.JwtUserPrincipal;
import com.freshfits.ecommerce.service.orders.OrderService;

import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

@GetMapping("/by-user")
public ResponseEntity<PaginatedOrderResponse> getOrders(
        @AuthenticationPrincipal JwtUserPrincipal principal,
        @RequestParam(defaultValue = "0") Integer page,
        @RequestParam(defaultValue = "10") Integer size) {

    PaginatedOrderResponse orders = orderService.getOrdersWithItems(principal.id(), page, size);
    return ResponseEntity.ok(orders);
}

  @GetMapping("/{orderNumber}")
    public ResponseEntity<OrderResponse> getOrderById(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable String orderNumber) {

        // Pass userId from JWT and orderId to service
        OrderResponse order = orderService.getOrderById(principal.id(), orderNumber);

        return ResponseEntity.ok(order);
    }






    
}
