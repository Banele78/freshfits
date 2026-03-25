package com.freshfits.ecommerce.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String token;

    private Instant expiryDate;

    @ManyToOne(fetch = FetchType.LAZY) // <-- change EAGER -> LAZY
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    //  @Column(nullable = false)
    // private String deviceId; // e.g., random UUID or fingerprint

    // Getters and Setters
}
