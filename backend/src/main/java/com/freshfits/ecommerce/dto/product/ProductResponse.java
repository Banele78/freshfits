package com.freshfits.ecommerce.dto.product;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.freshfits.ecommerce.dto.BrandResponse;
import com.freshfits.ecommerce.dto.DepartmentResponse;
import com.freshfits.ecommerce.dto.ProductSizesReponse;
import com.freshfits.ecommerce.dto.ReviewDTO;
import com.freshfits.ecommerce.entity.Brands;
import com.freshfits.ecommerce.entity.Category;

import com.freshfits.ecommerce.entity.Departments;
import com.freshfits.ecommerce.entity.ProductsSizes;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private int stockQuantity;
    private List<String> imageUrls;
    private String weight;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String category;
    private List<ReviewDTO> reviews;
    private String brand;
    private String department;
    private String fitType;
    private List<ProductSizesReponse> productsSizes;
    private String slug;
}

