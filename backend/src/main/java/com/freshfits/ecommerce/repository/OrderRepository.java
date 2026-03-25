package com.freshfits.ecommerce.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.freshfits.ecommerce.dto.order.OrderSummaryDTO;
import com.freshfits.ecommerce.entity.Order;
import com.freshfits.ecommerce.entity.Order.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
  
    /**
     * Find all orders with a given status that have expired reservations.
     */
    List<Order> findAllByStatusAndReservationExpiresAtBefore(OrderStatus status, LocalDateTime before);

      // Page only IDs for lightweight paging
    @Query("select o.id " +
           "from Order o " +
           "where o.status = :status and o.reservationExpiresAt <= :cutoff")
    Page<Long> findExpiredReservationIds(@Param("status") OrderStatus status,
                                         @Param("cutoff") LocalDateTime cutoff,
                                         Pageable pageable);

    // Fetch graph (items + products) for a batch of orders
    @EntityGraph(attributePaths = {"orderItems", "orderItems.product"})
    List<Order> findAllByIdIn(List<Long> ids);

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
     Page<Order> findByUserId(Long userId, Pageable pageable);   // for pagination


     @Query("""
SELECT new com.freshfits.ecommerce.dto.order.OrderSummaryDTO(
    o.id,
    o.orderNumber,
    o.totalAmount,
    o.status,
    o.createdAt,
    o.deliveryMethod, 
    o.deliveryFee,
    o.deliveryDate,
    o.subtotalAmount,
    a.id,
    a.addressLine1,
    a.addressLine2,
    a.city,
    a.province,
    a.postalCode,
    a.country,
    a.phoneNo,
    a.name,
    a.surname,
    a.companyName,
    a.addressType,
    yc.yocoCheckoutUrl
)
FROM Order o
 JOIN o.shippingAddress a
 JOIN o.yocoCheckout yc
WHERE o.user.id = :userId
""")
Page<OrderSummaryDTO> findOrdersWithAddress(
        @Param("userId") Long userId,
        Pageable pageable
);


@Query("""
SELECT new com.freshfits.ecommerce.dto.order.OrderSummaryDTO(
    o.id,
    o.orderNumber,
    o.totalAmount,
    o.status,
    o.createdAt,
    o.deliveryMethod,   
    o.deliveryFee,
    o.deliveryDate,
    o.subtotalAmount,
    a.id,
    a.addressLine1,
    a.addressLine2,
    a.city,
    a.province,
    a.postalCode,
    a.country,
    a.phoneNo,
    a.name,
    a.surname,
    a.companyName,
    a.addressType,
    yc.yocoCheckoutUrl
)
FROM Order o
JOIN o.shippingAddress a
JOIN o.yocoCheckout yc
WHERE o.user.id = :userId
AND o.orderNumber = :orderNumber
""")
Optional<OrderSummaryDTO> findOrderByIdWithAddress(
        @Param("userId") Long userId,
        @Param("orderNumber") String orderNumber
);

@Query("""
        SELECT CASE WHEN COUNT(oi) > 0 THEN true ELSE false END
        FROM Order o
        JOIN o.orderItems oi
        JOIN oi.productSize ps
        WHERE o.user.id = :userId
          AND ps.product.id = :productId
          AND o.status = 'DELIVERED'
    """)
    boolean hasUserPurchasedProduct(
        @Param("userId") Long userId,
        @Param("productId") Long productId
    );

 
}
