package com.freshfits.ecommerce.exception;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(Long name) {
        super("Category not found: " + name);
    }
}
