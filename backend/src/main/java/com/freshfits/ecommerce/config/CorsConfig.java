package com.freshfits.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        List<String> allowedOrigins = Arrays.asList(
            "http://127.0.0.1:5500",
            "http://localhost:5173",
            "http://localhost:5174",
            "https://50274761992a.ngrok-free.app",
            "http://192.168.32.1:5173",
            "http://192.168.1.71:5173",
            "https://f2424e05792b.ngrok-free.app",
            "https://freshfitssa.netlify.app"
        );

        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With","ngrok-skip-browser-warning"
));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("X-New-Access-Token"));
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
