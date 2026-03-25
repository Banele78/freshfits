package com.freshfits.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.freshfits.ecommerce.config.CustomUserDetails;
import com.freshfits.ecommerce.dto.AddToCartRequest;
import com.freshfits.ecommerce.dto.cart.CartDTO;
import com.freshfits.ecommerce.jwt.JwtUserPrincipal;
import com.freshfits.ecommerce.service.cart.CartService;

/**
 * REST controller for handling shopping cart operations.
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Modify the user’s cart (add, subtract, delete item).
     * Supported actions: "add", "subtract", "delete"
     */
    @PostMapping("/modify")
    public ResponseEntity<String> modifyCart(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @RequestBody AddToCartRequest request) {

            cartService.modifyCartItemByEmail(principal.id(),request.getProductSizeId(), request.getQuantity(), request.getAction());

            String message;
            switch (request.getAction().toLowerCase()) {
                case "add":
                    message = "Item(s) added to cart successfully.";
                    break;
                case "subtract":
                    message = "Item(s) subtracted from cart successfully.";
                    break;
                case "delete":
                    message = "Item deleted from cart successfully.";
                    break;
                default:
                    message = "Invalid action. Allowed actions: add, subtract, delete.";
            }

            return ResponseEntity.ok(message);
    }

    /**
     * Get the current user’s cart.
     */
    @GetMapping("/view")
    public ResponseEntity<CartDTO> getCart(@AuthenticationPrincipal JwtUserPrincipal principal) {
        CartDTO cart = cartService.getCartDTOByEmail(principal.id());
        return ResponseEntity.ok(cart);
    }

    /**
     * Clear the user’s entire cart.
     */
    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart(@AuthenticationPrincipal JwtUserPrincipal principal) {
        
        cartService.clearCart(principal.id());
        return ResponseEntity.ok("Cart cleared successfully.");
    }
}
