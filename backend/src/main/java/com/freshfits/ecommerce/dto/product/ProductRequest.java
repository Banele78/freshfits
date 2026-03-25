package com.freshfits.ecommerce.dto.product;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @Null(groups = OnCreate.class, message = "Product ID should be null for creation")
    @NotNull(groups = OnUpdate.class, message = "Product ID cannot be null for update")
    private Long id;

    @NotBlank(groups = OnCreate.class, message = "Product name cannot be blank")
    private String name;

    private String description;

    @NotNull(groups = OnCreate.class, message = "Price cannot be null")
    @PositiveOrZero(message = "Price must be zero or positive")
    private BigDecimal price;


    private List<MultipartFile> files;

    @NotBlank(groups = OnCreate.class, message = "Category name cannot be blank")
    private Long categoryId;


    @NotBlank(groups = OnCreate.class, message = "Brand name cannot be blank")
    private Long brandId;

    @NotBlank(groups = OnCreate.class, message = "Department name cannot be blank")
    private Long departmentId;

     private Long fitTypeId;

     // 👇 THIS is the key
    private List<SizeStockRequest> sizes;

   

    
    // Getters & setters omitted for brevity
}

