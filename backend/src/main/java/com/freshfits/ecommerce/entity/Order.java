package com.freshfits.ecommerce.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Setter;
import lombok.Getter;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.JoinColumn;

@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order {

       public enum OrderStatus {
    PENDING,
    CANCELLED,
    COMPLETED,
    PAID,
    REFUNDED,
    REFUND_FAILED,
    SHIPPED,
    DELIVERED
}



public enum DeliveryMethod {
    STANDARD,
    EXPRESS,
    PICKUP
}


    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String orderNumber; // Customer-facing

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private BigDecimal totalAmount;

    private BigDecimal subtotalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING; // Use enum directly


    private LocalDateTime createdAt = LocalDateTime.now();

     // Link to shipping address
    @ManyToOne
    @JoinColumn(name = "address_id", nullable = true)
    private Address shippingAddress;

    private LocalDateTime updatedAt;
    private LocalDateTime paidAt;
   @Column(nullable = false)
    private LocalDateTime reservationExpiresAt;

     @Column(nullable = false)
    private boolean isReserved  = false;

    // Order items
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;

      // Order items
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private YocoCheckouts yocoCheckout;

    @Version
private Long version;

     @Enumerated(EnumType.STRING)
    private DeliveryMethod deliveryMethod;

    private BigDecimal deliveryFee;

    private LocalDateTime deliveryDate;


@PrePersist
public void assignOrderNumber() {
    if (this.orderNumber == null) {
        // Last 7 digits of timestamp in seconds
        long timestamp = System.currentTimeMillis() / 1000 % 10000000;
        // 3-digit random number
        int randomSuffix = ThreadLocalRandom.current().nextInt(100, 1000);
        // Combine into 10-digit number
        String numericPart = String.format("%07d%03d", timestamp, randomSuffix);
        // Add prefix
        this.orderNumber = "ORD-" + numericPart;
    }
}

     
}
