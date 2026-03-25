package com.freshfits.ecommerce.config;

import org.springframework.cache.CacheManager;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.freshfits.ecommerce.service.products.ProductService;
import com.github.benmanes.caffeine.cache.Caffeine;

import java.time.Duration;


import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;


@Configuration
@EnableCaching
public class CacheConfig {

@Bean
public CacheManager cacheManager() {
    CaffeineCacheManager cacheManager = new CaffeineCacheManager("filterOptions","AvailablefilterOptions");
    cacheManager.setCaffeine(
        Caffeine.newBuilder()
                .expireAfterWrite(Duration.ofMinutes(10)) // expires instead of refresh
                .maximumSize(100)
    );
    return cacheManager;
}


}