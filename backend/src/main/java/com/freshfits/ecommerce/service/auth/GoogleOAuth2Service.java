package com.freshfits.ecommerce.service.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.freshfits.ecommerce.dto.auth.LoginResponseDTO;
import com.freshfits.ecommerce.entity.User;
import com.freshfits.ecommerce.jwt.JwtService;
import com.freshfits.ecommerce.repository.UserRepository;
import com.freshfits.ecommerce.service.auth.notification.AuthNoticationService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class GoogleOAuth2Service extends OidcUserService {

    private static final Logger log = LoggerFactory.getLogger(GoogleOAuth2Service.class);

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuthNoticationService notificationService;
     private final PasswordEncoder passwordEncoder;

    // 🔑 No OidcUserService injected → avoids circular dependency
    private final OidcUserService delegate = new OidcUserService();

    public GoogleOAuth2Service(UserRepository userRepository,
                               JwtService jwtService,
                               RefreshTokenService refreshTokenService,
                               AuthNoticationService notificationService,
                               PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.notificationService = notificationService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("Delegating to default OidcUserService for client: {}",
                 userRequest.getClientRegistration().getRegistrationId());

        // ✅ Load the user with the default logic
        OidcUser oidcUser = delegate.loadUser(userRequest);

        if (oidcUser.getEmail() == null || oidcUser.getEmail().isEmpty()) {
            throw new OAuth2AuthenticationException("Email not found from Google");
        }

        log.info("Successfully loaded OIDC user: {}", oidcUser.getEmail());

        return processOAuth2User(oidcUser);
    }

    private OidcUser processOAuth2User(OidcUser oidcUser) {
        String email = oidcUser.getEmail();
        String name = oidcUser.getFullName();
        String googleId = oidcUser.getSubject();

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            log.info("Existing user found: {}", email);

            if (!user.isGoogleLogin()) {
                user.setGoogleLogin(true);
                user.setGoogleId(googleId);
                user.setActive(true);
                userRepository.save(user);
                log.info("Updated user with Google login info: {}", email);
            }
        } else {
            user = createNewUserFromGoogle(email, name, googleId);
            log.info("Created new user from Google: {}", email);
             // Send welcome email for new Google users
            notificationService.sendWelcomeEmail(user);
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        log.info("Updated last login for user: {}", email);

        return oidcUser; // keep claims & authorities intact
    }

    private User createNewUserFromGoogle(String email, String name, String googleId) {
        User user = User.builder()
                .name(name)
                .email(email.toLowerCase())
                .password(passwordEncoder.encode(UUID.randomUUID().toString())) // no password for Google accounts
                .isActive(true)
                .isGoogleLogin(true)
                .googleId(googleId)
                .role(User.Role.USER)
                .createdAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }

    @Transactional
    public LoginResponseDTO handleGoogleLogin(String email) {
        log.info("Handling Google login for: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new OAuth2AuthenticationException("User not found: " + email));

        
        // Check if account is active
        if (!user.isActive()) {
            throw new OAuth2AuthenticationException("Account not activated");
        }

        // Check if account is locked by admin
        if (user.isLocked()) {
            throw new OAuth2AuthenticationException("Account has been locked by administrator");
        }
        
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = refreshTokenService.createRefreshToken(user).getToken();

        Map<String, Object> userData = new HashMap<>();
        userData.put("role", user.getRole());
        userData.put("email", user.getEmail());
        userData.put("name", user.getName());
        userData.put("isGoogleLogin", true);

        log.info("Google login successful for user: {}", email);

        return new LoginResponseDTO(accessToken, refreshToken, userData);
    }
}
