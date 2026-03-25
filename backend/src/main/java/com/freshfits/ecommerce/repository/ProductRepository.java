package com.freshfits.ecommerce.repository;

import com.freshfits.ecommerce.dto.product.ProductListDTO;
import com.freshfits.ecommerce.entity.Product;
import com.freshfits.ecommerce.entity.ProductImage;
import com.freshfits.ecommerce.entity.ProductsSizes;
import com.freshfits.ecommerce.entity.Review;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    // Existing methods
    List<Product> findByIsActive(boolean isActive);
    List<Product> findByIsActiveAndNameContainingIgnoreCase(boolean isActive, String name);
    
    // In ProductRepository
       // Fetch distinct categories, brands, departments
    @Query("""
        SELECT DISTINCT p.category.name, p.brand.name, p.department.name 
        FROM Product p 
        WHERE p.isActive = true AND p.id IN :productIds
    """)
    List<Object[]> findDistinctFilterValuesByProductIds(@Param("productIds") List<Long> productIds);

     @Query("""
        SELECT DISTINCT p.category.name, p.brand.name, p.department.name 
        FROM Product p 
        WHERE p.isActive = true
    """)
    List<Object[]> findAllDistinctFilterValues();

    // Fetch min and max price in a single row
    @Query("SELECT MIN(p.price), MAX(p.price) FROM Product p WHERE p.isActive = true")
List<Object[]> findMinAndMaxPrice();

@Query("""
    SELECT MIN(p.price), MAX(p.price)
    FROM Product p
    WHERE p.isActive = true AND p.id IN :productIds
""")
List<Object[]> findMinAndMaxPriceByProductIds(@Param("productIds") List<Long> productIds);



@Query("""
SELECT new com.freshfits.ecommerce.dto.product.ProductListDTO(
    p.id,
    p.name,
    p.price,
    b.name,
    c.name,
    d.name,
    ft.name,
    p.slug
)
FROM Product p
JOIN p.brand b
JOIN p.category c
JOIN p.department d
LEFT JOIN p.fitType ft
WHERE p.isActive = true
  AND (:categories IS NULL OR c.name IN :categories)
  AND (:brands IS NULL OR b.name IN :brands)
  AND (:departments IS NULL OR d.name IN :departments)
  AND (:searchQuery IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :searchQuery, '%')) or
       LOWER(p.description) LIKE LOWER(CONCAT('%', :searchQuery, '%')) or
       LOWER(b.name) LIKE LOWER(CONCAT('%', :searchQuery, '%')) or
       LOWER(ft.name) LIKE LOWER(CONCAT('%', :searchQuery, '%')))
  AND (
      :minPrice IS NULL
      OR :maxPrice IS NULL
      OR p.price BETWEEN :minPrice AND :maxPrice
)
""")
Page<ProductListDTO> findFilteredProducts(
        @Param("categories") List<String> categories,
        @Param("brands") List<String> brands,
        @Param("departments") List<String> departments,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("searchQuery") String searchQuery,
        Pageable pageable
);


// Fetch only product IDs based on filters
@Query("""
    SELECT p.id 
    FROM Product p
    JOIN p.brand b
    JOIN p.category c
    JOIN p.department d
    LEFT JOIN p.fitType ft
    WHERE p.isActive = true
      AND (:searchQuery IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :searchQuery, '%')) 
          OR LOWER(p.description) LIKE LOWER(CONCAT('%', :searchQuery, '%')) 
          OR LOWER(b.name) LIKE LOWER(CONCAT('%', :searchQuery, '%'))
          OR LOWER(ft.name) LIKE LOWER(CONCAT('%', :searchQuery, '%')))
""")
List<Long> findFilteredProductIds(
    @Param("searchQuery") String searchQuery
);

@Query("""
SELECT DISTINCT p
FROM Product p
LEFT JOIN FETCH p.brand
LEFT JOIN FETCH p.category
LEFT JOIN FETCH p.department
LEFT JOIN FETCH p.fitType
LEFT JOIN FETCH p.productsSizes ps
LEFT JOIN FETCH ps.size
WHERE p.slug = :slug AND p.isActive = true
""")
Product findProductWithDetailsBySlug(@Param("slug") String slug);



@Query("""
    SELECT r
    FROM Review r
    JOIN FETCH r.user
    WHERE r.product.id = :productId
""")
List<Review> findReviewsByProductId(@Param("productId") Long productId);



boolean existsBySlug(String slug);

@Query("""
        SELECT ps.id, ps.stockQuantity 
        FROM ProductsSizes ps
        WHERE ps.id IN :productSizeIds
    """)
    List<Object[]> findStockQuantitiesByProductSizeIds(@Param("productSizeIds") List<Long> productSizeIds);



}