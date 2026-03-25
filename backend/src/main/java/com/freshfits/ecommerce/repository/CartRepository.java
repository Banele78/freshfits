package com.freshfits.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.freshfits.ecommerce.dto.cart.CartItemDTOProjection;

import com.freshfits.ecommerce.entity.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {



// Optimized - fetches only what's needed
    @Query("""
        SELECT c FROM Cart c
        LEFT JOIN FETCH c.items ci
        LEFT JOIN FETCH ci.productSize ps
        WHERE c.user.id = :userId
    """)
    Optional<Cart> findByUserIdWithItemsMinimal(@Param("userId") Long userId);
    
    @Query("""
        SELECT c FROM Cart c
        WHERE c.user.id = :userId
    """)
    Optional<Cart> findByUserId(@Param("userId") Long userId);
    
    // Alternative: DTO projection for better performance
  


    // Alternative: DTO projection for better performance
@Query("""
    SELECT 
        ci.id AS cartItemId,
        ps.id AS productSizeId,
        p.id AS productId,
        p.name AS productName,
        p.slug AS productSlug,
        s.name AS sizeName,
        ci.quantity AS quantity,
        p.price AS unitPrice,
        ps.stockQuantity AS stockQuantity,
        ps.reservedQuantity AS reservedQuantity,
        ci.addedAt AS addedAt,
        pi.s3Key AS primaryImageS3Key
    FROM CartItem ci
    JOIN ci.productSize ps
    JOIN ps.product p
    JOIN ps.size s
    LEFT JOIN ProductImage pi 
        ON pi.product = p AND pi.isPrimary = true
    WHERE ci.cart.id = (
        SELECT c.id 
        FROM Cart c 
        WHERE c.user.id = :userId 
    )
    ORDER BY ci.addedAt DESC
""")
List<CartItemDTOProjection> findCartItemsByUserId(@Param("userId") Long userId);




}
