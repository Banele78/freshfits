

package com.freshfits.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.freshfits.ecommerce.entity.ProductsSizes;

@Repository
public interface ProductsSizesRepository extends JpaRepository<ProductsSizes, Long> {

  @Modifying
    @Query("""
        UPDATE ProductsSizes ps
        SET ps.reservedQuantity = ps.reservedQuantity + :qty
        WHERE ps.id = :id
          AND (ps.stockQuantity - ps.reservedQuantity) >= :qty
    """)
    int reserveStock(@Param("id") Long productSizeId, @Param("qty") int qty);
    
    @Modifying
    @Query("""
        UPDATE ProductsSizes ps
        SET ps.reservedQuantity = ps.reservedQuantity - :qty
        WHERE ps.id = :id
          AND ps.reservedQuantity >= :qty
    """)
    int releaseStock(@Param("id") Long productSizeId, @Param("qty") int qty);
    
    @Query("""
        SELECT ps FROM ProductsSizes ps
        LEFT JOIN FETCH ps.product p
        LEFT JOIN FETCH ps.size s
        WHERE ps.id = :id
    """)
    Optional<ProductsSizes> findByIdWithProduct(@Param("id") Long id);

    
}
