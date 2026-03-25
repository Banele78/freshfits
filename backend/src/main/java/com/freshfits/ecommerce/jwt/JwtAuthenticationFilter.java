package com.freshfits.ecommerce.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.freshfits.ecommerce.exception.InvalidTokenException;

import io.jsonwebtoken.ExpiredJwtException;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Stateless JWT filter for access tokens.
 * Optional: You can include DB lookup for refresh token version validation if needed.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
     private static final String AUTHENTICATION_FAILED = "Authentication failed";

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain chain
    ) throws ServletException, IOException {

        try {
            String token = extractToken(request);

            if (token != null) {
                authenticate(token);
            }

            chain.doFilter(request, response);

        } catch (ExpiredJwtException ex) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        } catch (Exception ex) {
            log.warn("JWT authentication failed: {}", ex.getMessage());
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        return (header != null && header.startsWith("Bearer "))
                ? header.substring(7)
                : null;
    }

    private void authenticate(String token) {

       if (!jwtService.isTokenValid(token)) {
            throw new InvalidTokenException(AUTHENTICATION_FAILED);
        }

        Long userId = jwtService.extractUserId(token);
        String email = jwtService.extractEmail(token);
        List<String> roles = jwtService.extractRoles(token);
        String name = jwtService.extractUserName(token);

        var authorities = roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        new JwtUserPrincipal(userId, email, name),
                        null,
                        authorities
                );

        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Skip authentication for public endpoints
        return path.startsWith("/api/auth")
                || path.startsWith("/api/products")
                || path.startsWith("/api/brands")
                || path.startsWith("/api/categories")
                || path.startsWith("/oauth2")
                || path.startsWith("/login")
                || path.startsWith("/error");
    }
}
