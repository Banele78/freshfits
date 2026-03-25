package com.freshfits.ecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import com.freshfits.ecommerce.jwt.JwtAuthenticationFilter;
import com.freshfits.ecommerce.service.auth.GoogleOAuth2Service;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomAuthenticationEntryPoint customAuthEntryPoint;
    private final OAuth2SuccessHandler oauth2SuccessHandler;
    private final GoogleOAuth2Service googleOAuth2Service;
    private final CorsConfigurationSource corsConfigurationSource;
     private final ClientRegistrationRepository clientRegistrationRepository;

     @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthFilter,
            CustomAuthenticationEntryPoint customAuthEntryPoint,
            OAuth2SuccessHandler oauth2SuccessHandler,
            GoogleOAuth2Service googleOAuth2Service,
            CorsConfigurationSource corsConfigurationSource,
            ClientRegistrationRepository clientRegistrationRepository) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.customAuthEntryPoint = customAuthEntryPoint;
        this.oauth2SuccessHandler = oauth2SuccessHandler;
        this.googleOAuth2Service = googleOAuth2Service;
        this.corsConfigurationSource = corsConfigurationSource;
        this.clientRegistrationRepository = clientRegistrationRepository;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource)) // Use CorsConfig
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/products/**", "/api/webhook/yoco", 
                "/api/sizes/grouped", "/api/brands/all", "/api/categories/all", 
                 "/api/departments/all", "/api/fit-types/all", "/api/reviews/product/{productId}").permitAll()
                .requestMatchers("/api/auth/**", "/login/**", "/oauth2/**", "/error").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex.authenticationEntryPoint(customAuthEntryPoint))
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .oidcUserService(googleOAuth2Service::loadUser))
                 .authorizationEndpoint(authorization -> authorization
                    .authorizationRequestResolver(
                        new CustomOAuth2AuthorizationRequestResolver(clientRegistrationRepository)
                    )
                )
                .successHandler(oauth2SuccessHandler)
                .failureHandler((request, response, exception) -> {
                    response.sendRedirect(frontendUrl + "/login-redirect?error=" +
                        java.net.URLEncoder.encode(
                            String.valueOf(exception.getMessage()),
                            java.nio.charset.StandardCharsets.UTF_8));
                })
            );

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

   
}
