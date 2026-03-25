package com.freshfits.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.freshfits.ecommerce.dto.ReviewDTO;
import com.freshfits.ecommerce.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByUserIdAndProductId(Long userId, Long productId);

    
    // Fetch a review by user ID and product ID
    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);

    @Modifying
    @Query(value = """
        INSERT INTO reviews (user_id, product_id, rating, comment, created_at, updated_at)
        VALUES (:userId, :productId, :rating, :comment, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
            rating = VALUES(rating),
            comment = VALUES(comment),
            updated_at = NOW()
        """, nativeQuery = true)
    int upsertReview(
        @Param("userId") Long userId,
        @Param("productId") Long productId,
        @Param("rating") int rating,
        @Param("comment") String comment
    );

    @Query("""
        SELECT r
        FROM Review r
        JOIN FETCH r.user
        WHERE r.user.id = :userId AND r.product.id = :productId
    """)
    Review findForResponse(@Param("userId") Long userId,
                           @Param("productId") Long productId);

                           
@Query("""
        SELECT new com.freshfits.ecommerce.dto.ReviewDTO(
            r.id,
            r.rating,
            r.comment,
            r.user.name,
            r.createdAt,
            r.updatedAt,
            CASE WHEN r.user.id = :userId THEN true ELSE false END
        )
        FROM Review r
        WHERE r.product.id = :productId
        ORDER BY r.updatedAt DESC
    """)
    List<ReviewDTO> findReviewsByProductIdWithMine(
        @Param("productId") Long productId,
        @Param("userId") Long userId
    );
  

}
