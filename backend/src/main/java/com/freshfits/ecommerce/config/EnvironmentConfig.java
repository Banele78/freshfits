// package com.freshfits.ecommerce.config;

// import io.github.cdimascio.dotenv.Dotenv;
// import jakarta.annotation.PostConstruct;

// import org.springframework.context.annotation.Configuration;



// @Configuration
// public class EnvironmentConfig {

//     @PostConstruct
//     public void loadEnvironmentVariables() {
//         try {
//             Dotenv dotenv = Dotenv.configure()
//                 .directory("./backend") // Adjust path if necessary
//                 .ignoreIfMalformed()
//                 .ignoreIfMissing()
//                 .load();
            
//             // Set system properties from .env file
//             dotenv.entries().forEach(entry -> {
//                 String key = entry.getKey();
//                 String value = entry.getValue();
//                 System.setProperty(key, value);
//                 System.out.println("Loaded environment variable: " + key + "=" + maskSensitiveValue(key, value));
//             });
//         } catch (Exception e) {
//             System.err.println("Failed to load .env file: " + e.getMessage());
//         }
//     }
    
//     private String maskSensitiveValue(String key, String value) {
//         if (value == null || value.length() <= 4) {
//             return "***";
//         }
//         if (key.toLowerCase().contains("secret") || key.toLowerCase().contains("password")) {
//             return value.substring(0, 4) + "***" + value.substring(value.length() - 4);
//         }
//         return value;
//     }
// }