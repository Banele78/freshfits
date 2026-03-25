package com.freshfits.ecommerce.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.freshfits.ecommerce.config.CustomUserDetails;
import com.freshfits.ecommerce.dto.ReviewDTO;
import com.freshfits.ecommerce.dto.ReviewRequest;
import com.freshfits.ecommerce.entity.User;
import com.freshfits.ecommerce.jwt.JwtUserPrincipal;
import com.freshfits.ecommerce.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }


     @PostMapping("/create")
    public ResponseEntity<ReviewDTO> saveOrUpdateReview(
            @RequestBody ReviewRequest request,
             @AuthenticationPrincipal JwtUserPrincipal principal // or get from security context
    ) {

      
        ReviewDTO reviewDTO = reviewService.saveOrUpdateReview(request, principal.id());
        return ResponseEntity.ok(reviewDTO);
    }

      @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByProduct(
            @PathVariable Long productId,
            @AuthenticationPrincipal JwtUserPrincipal principal // optional Spring Security principal
    ) {
        Long userId = (principal != null) ? principal.id() : null;
        List<ReviewDTO> reviews = reviewService.getReviewsByProductId(productId, userId);
        return ResponseEntity.ok(reviews);
    }
}
