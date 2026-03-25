package com.freshfits.ecommerce.exception;

public class DepartmentNotFoundException extends RuntimeException {
    public DepartmentNotFoundException(Long name) {
        super("Department not found: " + name);
    }
}