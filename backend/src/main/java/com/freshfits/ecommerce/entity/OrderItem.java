package com.freshfits.ecommerce.entity;
import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.Setter;
import lombok.Getter;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;

@Getter
@Setter
@Entity
@Table(name = "orderItems")
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private int quantity;
    private BigDecimal price;

    private BigDecimal unitPrice;

    @ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "product_size_id", nullable = false)
private ProductsSizes productSize;

}
