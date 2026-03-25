package com.freshfits.ecommerce.dto.product;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.RequestParam;

@Data
public class ProductFilterRequest {
    private List<String> categories;
    private List<String> brands;
    private List<String> departments;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String sortBy = "default";
    
    
    private String searchQuery;

    private Integer page = 0;
    private Integer size = 20;
    
}
