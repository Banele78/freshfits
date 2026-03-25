package com.freshfits.ecommerce.exception;

public class BrandNotFoundException extends RuntimeException {
    public BrandNotFoundException(Long name) {
        super("Brand not found: " + name);
    }
}
