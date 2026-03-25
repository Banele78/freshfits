package com.freshfits.ecommerce.exception;

import java.util.List;
import java.util.Map;

import com.freshfits.ecommerce.dto.order.UnavailableItem;

public class ProductStockUnavailableException extends RuntimeException {

    private final List<UnavailableItem> unavailableItems;

    public ProductStockUnavailableException(
            String message,
            List<UnavailableItem> unavailableItems
    ) {
        super(message);
        this.unavailableItems = unavailableItems;
    }

    public List<UnavailableItem> getUnavailableItems() {
        return unavailableItems;
    }
}


