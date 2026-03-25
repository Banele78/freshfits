package com.freshfits.ecommerce.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.freshfits.ecommerce.util.EnvLoader;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestEnvController {

    @GetMapping("/env")
    public Map<String, String> checkEnv() {
        String clientId = EnvLoader.get("GOOGLE_CLIENT_ID");
        String clientSecret = EnvLoader.get("GOOGLE_CLIENT_SECRET");
        
        return Map.of(
            "clientId_set", clientId != null ? "YES" : "NO",
            "clientSecret_set", clientSecret != null ? "YES" : "NO",
            "clientId_length", clientId != null ? String.valueOf(clientId.length()) : "0",
            "method", "dotenv"
        );
    }
    
    @GetMapping("/env-system")
    public Map<String, String> checkSystemEnv() {
        String clientId = System.getenv("GOOGLE_CLIENT_ID");
        String clientSecret = System.getenv("GOOGLE_CLIENT_SECRET");
        
        return Map.of(
            "clientId_set", clientId != null ? "YES" : "NO",
            "clientSecret_set", clientSecret != null ? "YES" : "NO",
            "method", "system"
        );
    }
}
