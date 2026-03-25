package com.freshfits.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.freshfits.ecommerce.dto.order.OrderItemDTO;
import com.freshfits.ecommerce.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

@Query("""
SELECT new com.freshfits.ecommerce.dto.order.OrderItemDTO(
    oi.order.id,
    p.id,
    p.name,
    p.slug,
    oi.quantity,
    oi.price,
    img.s3Key,
    s.name
)
FROM OrderItem oi
JOIN oi.productSize ps
JOIN ps.product p
JOIN  ps.size s
LEFT JOIN ProductImage img 
       ON img.product.id = p.id 
       AND img.isPrimary = true
WHERE oi.order.id IN :orderIds
""")
List<OrderItemDTO> findOrderItemsWithPrimaryImages(@Param("orderIds") List<Long> orderIds);





    
}
