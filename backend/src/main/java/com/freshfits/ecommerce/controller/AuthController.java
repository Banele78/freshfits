package com.freshfits.ecommerce.controller;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.freshfits.ecommerce.config.CustomUserDetails;
import com.freshfits.ecommerce.dto.auth.LoginRequestDTO;
import com.freshfits.ecommerce.dto.auth.LoginResponseDTO;
import com.freshfits.ecommerce.dto.auth.PasswordResetConfirmDTO;
import com.freshfits.ecommerce.dto.auth.PasswordResetRequestDTO;
import com.freshfits.ecommerce.dto.auth.UserMeDto;
import com.freshfits.ecommerce.dto.auth.UserRegisterDTO;
import com.freshfits.ecommerce.entity.RefreshToken;
import com.freshfits.ecommerce.entity.User;
import com.freshfits.ecommerce.exception.InvalidTokenException;
import com.freshfits.ecommerce.exception.RateLimitException;
import com.freshfits.ecommerce.exception.UserNotFoundException;
import com.freshfits.ecommerce.jwt.JwtService;
import com.freshfits.ecommerce.jwt.JwtUserPrincipal;
import com.freshfits.ecommerce.repository.UserRepository;
import com.freshfits.ecommerce.service.RateLimiterService;
import com.freshfits.ecommerce.service.auth.LoginService;
import com.freshfits.ecommerce.service.auth.PasswordResetService;
import com.freshfits.ecommerce.service.auth.RefreshTokenService;
import com.freshfits.ecommerce.service.auth.RegisterService;
import com.freshfits.ecommerce.util.ResponseBuilder;
import com.freshfits.ecommerce.util.ResponseConstants;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private static final String AUTHENTICATION_FAILED = "Authentication failed";
    private static final long SEVEN_DAYS_IN_SECONDS = 7L * 24 * 60 * 60;
    
    private static final String REFRESH_TOKEN_COOKIE = "refreshToken";

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordResetService passwordResetService;
    private final RateLimiterService rateLimiterService;
    private final RegisterService registerService;
    private final LoginService loginService;

    public AuthController(UserRepository userRepository,
                          JwtService jwtService,
                          RefreshTokenService refreshTokenService,
                          PasswordResetService passwordResetService,
                          RateLimiterService rateLimiterService,
                          RegisterService registerService,
                          LoginService loginService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.passwordResetService = passwordResetService;
        this.rateLimiterService = rateLimiterService;
        this.registerService = registerService;
        this.loginService = loginService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(
            @Valid @RequestBody UserRegisterDTO registerDTO,
            HttpServletRequest request) {
        
        log.info("Registration attempt for email: {}", registerDTO.getEmail());
        registerService.register(registerDTO, request);
        
        return ResponseEntity.ok(ResponseBuilder.success(ResponseConstants.MSG_REGISTRATION_SUCCESS));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<Map<String, Object>> verifyEmail(@RequestParam String token) {
        registerService.verifyEmail(token);
        return ResponseEntity.ok(ResponseBuilder.success(ResponseConstants.MSG_EMAIL_VERIFIED));
    }

     @PostMapping("/resend-verification")
    public ResponseEntity<Map<String, Object>> resendVerificationEmail(
           @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        String email = body.get("email"); // note: "emai" not "email"
            registerService.resendVerificationEmail(email, request);
    
            return ResponseEntity.ok(ResponseBuilder.success("Verification email sent successfully."));
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(
            @RequestBody LoginRequestDTO dto,
            HttpServletRequest request) {
        
        log.info("Login attempt for email: {}", dto.getEmail());
        
        LoginResponseDTO loginResponse = loginService.login(dto.getEmail(), dto.getPassword(), request);
        
        ResponseCookie cookie = ResponseCookie.from("refreshToken", loginResponse.getRefreshToken())
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(SEVEN_DAYS_IN_SECONDS)
            .sameSite("none")
             // .sameSite("Strict") // Consider "Lax" if issues arise with cross-site requests
            .build();
        
        Map<String, Object> response = ResponseBuilder.authSuccess(
            ResponseConstants.MSG_LOGIN_SUCCESS, 
            loginResponse.getAccessToken(), 
            loginResponse.getUser()
        );
        
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, cookie.toString())
            .body(response);
    }

@PostMapping("/refresh")
public ResponseEntity<Map<String, String>> refresh(HttpServletRequest request, HttpServletResponse response) {
    enforceRateLimit(request);

    String refreshToken = extractRefreshToken(request)
            .orElseThrow(() -> new InvalidTokenException("Missing refresh token"));

    RefreshToken consumed = refreshTokenService.consumeAndVerifyToken(refreshToken)
            .orElseThrow(() -> new InvalidTokenException("Invalid or expired refresh token"));

    User user = consumed.getUser();
   String newAccess = jwtService.generateAccessToken(user);
   RefreshToken newRefresh = refreshTokenService.createRefreshToken(user);

   setAuthCookies(response, newAccess, newRefresh.getToken());

    return ResponseEntity.ok(Map.of("accessToken", newAccess));

}


    /* -------- helpers -------- */

    private void enforceRateLimit(HttpServletRequest request) {
        String key = "refresh:" + request.getRemoteAddr();
        if (!rateLimiterService.tryConsume(key, 20, Duration.ofMinutes(1))) {
            throw new RateLimitException("Too many refresh attempts");
        }
    }

    private Optional<String> extractRefreshToken(HttpServletRequest request) {
        if (request.getCookies() == null) return Optional.empty();

        return Arrays.stream(request.getCookies())
                .filter(c -> REFRESH_TOKEN_COOKIE.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst();
    }

    private void setAuthCookies(HttpServletResponse response, String access, String refresh) {
        response.setHeader("X-New-Access-Token", access);

        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE, refresh)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(SEVEN_DAYS_IN_SECONDS)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(
            @Valid @RequestBody PasswordResetRequestDTO requestDTO,
            HttpServletRequest servletRequest) {
        
        String email = requestDTO.getEmail().toLowerCase();
        String ipAddress = servletRequest.getRemoteAddr();
        
        // IP-based rate limiting
        String ipKey = "forgot-password-ip:" + ipAddress;
        if (!rateLimiterService.tryConsume(ipKey, 5, Duration.ofMinutes(10))) {
            log.warn("IP rate limit exceeded for password reset from: {}", ipAddress);
            throw new RateLimitException("Too many password reset attempts");
        }
        
        // Email-based rate limiting
        String emailKey = "forgot-password-email:" + email;
        if (!rateLimiterService.tryConsume(emailKey, 3, Duration.ofHours(1))) {
            log.warn("Email rate limit exceeded for: {}", email);
            // Still return generic message for security
            return ResponseEntity.ok(ResponseBuilder.success("If the email exists, a password reset link has been sent"));
        }
        
        passwordResetService.requestPasswordReset(email);
        return ResponseEntity.ok(ResponseBuilder.success("If the email exists, a password reset link has been sent"));
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(
            @Valid @RequestBody PasswordResetConfirmDTO requestDTO,
            HttpServletRequest servletRequest) {
        
        String ipAddress = servletRequest.getRemoteAddr();
        
        // IP-based rate limiting
        String ipKey = "reset-password-ip:" + ipAddress;
        if (!rateLimiterService.tryConsume(ipKey, 15, Duration.ofMinutes(10))) {
            log.warn("Rate limit exceeded for password reset confirmation from IP: {}", ipAddress);
            throw new RateLimitException("Too many password reset attempts");
        }
        
        // Token-based rate limiting
        String tokenKey = "reset-password-token:" + requestDTO.getToken();
        if (!rateLimiterService.tryConsume(tokenKey, 10, Duration.ofHours(1))) {
            log.warn("Rate limit exceeded for token: {}", requestDTO.getToken());
            throw new RateLimitException("Too many attempts for this reset token");
        }
        
        if (!requestDTO.getNewPassword().equals(requestDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        
        passwordResetService.resetPassword(requestDTO.getToken(), requestDTO.getNewPassword());
        return ResponseEntity.ok(ResponseBuilder.success("Password has been reset successfully"));
    }
    
    @GetMapping("/validate-reset-token")
    public ResponseEntity<Map<String, Object>> validateResetToken(@RequestParam String token) {
        boolean isValid = passwordResetService.validateToken(token);
        return ResponseEntity.ok(Map.of("valid", isValid));
    }

    @PostMapping("/logout")
public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {

    // Extract refresh token from cookie
    String refreshToken = extractRefreshToken(request).orElse(null);

    if (refreshToken != null) {
        // Delete the refresh token from database
        refreshTokenService.consumeAndVerifyToken(refreshToken);
    }

    // Clear refresh token cookie
    ResponseCookie clearedCookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE, "")
            .httpOnly(true)
            .secure(true)
            .sameSite("None")
            .path("/")
            .maxAge(0) // expire immediately
            .build();

    response.addHeader(HttpHeaders.SET_COOKIE, clearedCookie.toString());

    return ResponseEntity.ok("Logged out successfully");
}


 

}