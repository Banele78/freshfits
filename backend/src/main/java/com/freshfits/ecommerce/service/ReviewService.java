package com.freshfits.ecommerce.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.freshfits.ecommerce.dto.ReviewDTO;
import com.freshfits.ecommerce.dto.ReviewRequest;
import com.freshfits.ecommerce.entity.Product;
import com.freshfits.ecommerce.entity.Review;
import com.freshfits.ecommerce.entity.User;
import com.freshfits.ecommerce.exception.InvalidReviewException;
import com.freshfits.ecommerce.exception.ProductNotFoundException;
import com.freshfits.ecommerce.exception.ResourceNotFoundException;
import com.freshfits.ecommerce.exception.UserNotFoundException;
import com.freshfits.ecommerce.repository.OrderRepository;
import com.freshfits.ecommerce.repository.ProductRepository;
import com.freshfits.ecommerce.repository.ReviewRepository;
import com.freshfits.ecommerce.repository.UserRepository;

import jakarta.transaction.Transactional;

import jakarta.persistence.EntityManager;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final EntityManager entityManager;


    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository, ProductRepository productRepository,
        EntityManager entityManager, OrderRepository orderRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
         this.entityManager =  entityManager;
         this.orderRepository= orderRepository;
    }

    @Transactional
public ReviewDTO saveOrUpdateReview(ReviewRequest request, Long userId) {

    if (request.getRating() < 1 || request.getRating() > 5) {
        throw new InvalidReviewException("Rating must be between 1 and 5");
    }

    boolean purchased = orderRepository.hasUserPurchasedProduct(userId, request.getProductId());
    if (!purchased) {
        throw new ResourceNotFoundException("You can only review products you have purchased");
    }

    reviewRepository.upsertReview(
            userId,
            request.getProductId(),
            request.getRating(),
            request.getComment()
    );

    // Fetch once for response (cheap, indexed)
    Review review = reviewRepository.findForResponse(
            userId,
            request.getProductId()
    );

    return mapToResponse(review);
}

@Transactional
public List<ReviewDTO> getReviewsByProductId(Long productId, Long userId) {
    return reviewRepository.findReviewsByProductIdWithMine(productId, userId);
}
 

    private ReviewDTO mapToResponse(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setUserName(review.getUser().getName());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}
