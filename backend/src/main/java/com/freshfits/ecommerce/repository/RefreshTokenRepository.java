package com.freshfits.ecommerce.repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import com.freshfits.ecommerce.dto.auth.RefreshTokenWithUserDTO;
import com.freshfits.ecommerce.dto.product.ProductListDTO;
import com.freshfits.ecommerce.entity.RefreshToken;
import com.freshfits.ecommerce.entity.User;

import jakarta.transaction.Transactional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    boolean existsByToken(String token);
     @Transactional
    int deleteByUser(User user);
    /** Deletes all tokens that expired before the given instant and returns the count */
    @Modifying
    @Transactional
    @Query("DELETE FROM RefreshToken t WHERE t.expiryDate < :instant")
    int deleteAllExpiredSince(Instant instant);

    Optional<RefreshToken> findByTokenAndExpiryDateAfter(String token, Instant now);

    @Modifying
@Transactional
@Query("DELETE FROM RefreshToken r WHERE r.token = :token AND r.expiryDate > :now")
int deleteByTokenAndNotExpired(@Param("token") String token, @Param("now") Instant now);


 @Query("""
        SELECT new com.freshfits.ecommerce.dto.auth.RefreshTokenWithUserDTO(
            r.id, r.token, r.expiryDate,
            u.id, u.name, u.email
        )
        FROM RefreshToken r
        JOIN r.user u
        WHERE r.token = :token AND r.expiryDate > :now
    """)
    Optional<RefreshTokenWithUserDTO> findValidTokenWithUser(
        @Param("token") String token,
        @Param("now") Instant now
    );

    @Modifying
    @Transactional
    @Query("DELETE FROM RefreshToken r WHERE r.token = :token AND r.expiryDate > :now")
    int deleteValidToken(@Param("token") String token, @Param("now") Instant now);
   
    
}