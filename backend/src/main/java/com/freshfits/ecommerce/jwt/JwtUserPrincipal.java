package com.freshfits.ecommerce.jwt;

import java.io.Serializable;

public record JwtUserPrincipal(Long id, String email, String name) implements Serializable {}

