package com.freshfits.ecommerce.exception;

public class FitTypeNotFoundException extends RuntimeException {
    public FitTypeNotFoundException(Long id) {
        super("FitType not found: " + id);
    }
}
