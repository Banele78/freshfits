package com.freshfits.ecommerce.repository;

import com.freshfits.ecommerce.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductIdOrderByIsPrimaryDesc(Long productId);

    @Query("""
SELECT i
FROM ProductImage i
WHERE i.product.id IN :productIds
ORDER BY i.isPrimary DESC
""")
List<ProductImage> findImagesForProducts(@Param("productIds") List<Long> productIds);

 @Query("""
        SELECT pi FROM ProductImage pi
        WHERE pi.product.id IN :productIds 
        AND pi.isPrimary = true
    """)
    List<ProductImage> findPrimaryImagesByProductIds(@Param("productIds") List<Long> productIds);
    
    @Query("""
        SELECT pi FROM ProductImage pi
        WHERE pi.product.id = :productId 
        AND pi.isPrimary = true
    """)
    Optional<ProductImage> findPrimaryImageByProductId(@Param("productId") Long productId);

 


}

