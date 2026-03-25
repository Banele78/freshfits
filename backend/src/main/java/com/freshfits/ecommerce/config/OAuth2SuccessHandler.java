package com.freshfits.ecommerce.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.freshfits.ecommerce.dto.auth.LoginResponseDTO;
import com.freshfits.ecommerce.service.auth.GoogleOAuth2Service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    private static final long SEVEN_DAYS_IN_SECONDS = 7L * 24 * 60 * 60;
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final GoogleOAuth2Service googleOAuth2Service;

    public OAuth2SuccessHandler(GoogleOAuth2Service googleOAuth2Service) {
        this.googleOAuth2Service = googleOAuth2Service;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        if (!(authentication.getPrincipal() instanceof OidcUser oidcUser)) {
            sendErrorResponse(response, "Invalid user type");
            return;
        }

        String email = oidcUser.getEmail();
        LoginResponseDTO loginResponse = googleOAuth2Service.handleGoogleLogin(email);

        // Set refresh token as HTTP-only cookie
        setRefreshTokenCookie(request, response, loginResponse.getRefreshToken());

        // Extract 'from' from state parameter
        String state = request.getParameter("state");
        String from = extractFromParameter(state);

        // Build redirect URL
        String redirectUrl = buildRedirectUrl(loginResponse, from);
        response.sendRedirect(redirectUrl);
    }

    private String extractFromParameter(String state) {
        String from = "/";
        
        if (state != null && !state.isEmpty()) {
            try {
                // Try to decode the state if it contains JSON
                String decodedState = new String(Base64.getUrlDecoder().decode(state));
                Map<String, Object> stateMap = objectMapper.readValue(decodedState, Map.class);
                if (stateMap.containsKey("from")) {
                    from = (String) stateMap.get("from");
                }
            } catch (Exception e) {
                // If state is not JSON, it might just be the from parameter
                // Check if it looks like a path (starts with /)
                if (state.startsWith("/")) {
                    from = state;
                }
            }
        }
        
        return from;
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        response.setContentType("application/json");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write(String.format(
            "{\"success\":false,\"message\":\"%s\"}",
            message
        ));
    }

    private void setRefreshTokenCookie(HttpServletRequest request, 
                                       HttpServletResponse response, 
                                       String refreshToken) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(SEVEN_DAYS_IN_SECONDS)
                .sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String buildRedirectUrl(LoginResponseDTO loginResponse, String from) throws IOException {
        Map<String, Object> user = loginResponse.getUser();
        
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(frontendUrl + "/login-redirect")
                .queryParam("accessToken", loginResponse.getAccessToken())
                .queryParam("name", URLEncoder.encode((String) user.get("name"), StandardCharsets.UTF_8.name()))
                .queryParam("email", URLEncoder.encode((String) user.get("email"), StandardCharsets.UTF_8.name()))
                .queryParam("from", URLEncoder.encode(from, StandardCharsets.UTF_8.name()));
        
        return builder.build().toUriString();
    }
}