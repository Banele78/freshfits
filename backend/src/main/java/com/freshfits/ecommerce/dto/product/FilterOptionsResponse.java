package com.freshfits.ecommerce.dto.product;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class FilterOptionsResponse {
    private List<String> categories;
    private List<String> brands;
    private List<String> departments;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
}