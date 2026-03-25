package com.freshfits.ecommerce.dto.auth;

import java.time.Instant;

public record RefreshTokenWithUserDTO(
    Long tokenId,
    String token,
    Instant expiryDate,
    Long userId,
    String userName,
    String userEmail
) {}
