package com.freshfits.ecommerce.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class CustomOAuth2AuthorizationRequestResolver
        implements OAuth2AuthorizationRequestResolver {

    private final OAuth2AuthorizationRequestResolver defaultResolver;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CustomOAuth2AuthorizationRequestResolver(
            ClientRegistrationRepository clientRegistrationRepository) {
        this.defaultResolver =
                new DefaultOAuth2AuthorizationRequestResolver(
                        clientRegistrationRepository,
                        "/oauth2/authorization"
                );
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
        OAuth2AuthorizationRequest req = defaultResolver.resolve(request);
        return customizeAuthorizationRequest(request, req);
    }

    @Override
    public OAuth2AuthorizationRequest resolve(
            HttpServletRequest request,
            String clientRegistrationId) {

        OAuth2AuthorizationRequest req =
                defaultResolver.resolve(request, clientRegistrationId);
        return customizeAuthorizationRequest(request, req);
    }

    private OAuth2AuthorizationRequest customizeAuthorizationRequest(
            HttpServletRequest request,
            OAuth2AuthorizationRequest authorizationRequest) {

        if (authorizationRequest == null) {
            return null;
        }

        Map<String, Object> additionalParameters =
                new HashMap<>(authorizationRequest.getAdditionalParameters());

        // Get 'from' parameter
        String from = request.getParameter("from");
        if (from == null || from.isEmpty()) {
            from = "/";
        }

        // Create a state object that contains our custom data
        Map<String, String> stateData = new HashMap<>();
        stateData.put("from", from);
        
        try {
            // Encode the state data as JSON and then base64
            String jsonState = objectMapper.writeValueAsString(stateData);
            String encodedState = Base64.getUrlEncoder().withoutPadding().encodeToString(jsonState.getBytes());
            
            // Return new authorization request with custom state
            return OAuth2AuthorizationRequest.from(authorizationRequest)
                    .state(encodedState)
                    .build();
            
        } catch (Exception e) {
            // If encoding fails, fall back to original request
            return authorizationRequest;
        }
    }
}