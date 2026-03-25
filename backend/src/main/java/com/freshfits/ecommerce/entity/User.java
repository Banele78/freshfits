package com.freshfits.ecommerce.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

       public enum Role {
    USER,
    ADMIN,
    
}

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

     @Column(nullable = false)
    private boolean isActive;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private Role role = Role.USER;

    @Builder.Default
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // 👇 new field for token revocation
    @Builder.Default
    @Column(name = "token_version", nullable = false)
    private Long tokenVersion = 0L; 

    // Additional fields for email verification and password reset
    private String emailVerificationToken;

    private LocalDateTime emailVerificationExpiry;

    private LocalDateTime lastLogin;

    private LocalDateTime lastReminderSent;

    @Builder.Default
    private boolean isLocked = false;

     @Builder.Default
    private boolean isMfaEnabled = false;

    private String lastLoginIp;

    @Builder.Default
    @Column(name = "is_google_login")
    private boolean isGoogleLogin = false;
    
    @Column(name = "google_id")
    private String googleId;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
   private List<Order> orders;

   @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
   private List<Address> address;

   @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
   private List<Cart> cart;

   @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Review> reviews;

@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
private List<RefreshToken> refreshTokens;

@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
private List<PasswordResetToken> passwordResetTokens;



   
}
