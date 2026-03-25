package com.freshfits.ecommerce.controller;


import jakarta.validation.groups.Default;
import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.freshfits.ecommerce.dto.product.FilterOptionsResponse;
import com.freshfits.ecommerce.dto.product.OnCreate;
import com.freshfits.ecommerce.dto.product.OnUpdate;
import com.freshfits.ecommerce.dto.product.PaginatedProductResponse;
import com.freshfits.ecommerce.dto.product.ProductFilterRequest;
import com.freshfits.ecommerce.dto.product.ProductRequest;
import com.freshfits.ecommerce.dto.product.ProductResponse;
import com.freshfits.ecommerce.entity.Product;
import com.freshfits.ecommerce.service.products.ProductDetailsService;
import com.freshfits.ecommerce.service.products.ProductService;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductDetailsService productDetailsService;

    @GetMapping
    public  ResponseEntity<ProductResponse>  getProductById (
        @RequestParam (value = "slug") String slug) {
           ProductResponse res = productDetailsService.getProductBySlug(slug);

        return ResponseEntity.ok(res);
    }
    


  // New endpoint for filtering with all parameters
     @GetMapping("/filter")
public ResponseEntity<PaginatedProductResponse> getFilteredProducts(
        @RequestParam(value = "category", required = false) List<String> categories,
        @RequestParam(value = "brand", required = false) List<String> brands,
        @RequestParam(value = "department", required = false) List<String> departments,
        @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
        @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
        @RequestParam(value = "sort", defaultValue = "default") String sortBy,
        @RequestParam(value = "q", required = false) String searchQuery,
        @RequestParam(value = "page", defaultValue = "0") Integer page,
        @RequestParam(value = "limit", defaultValue = "20") Integer limit
       
) {

    ProductFilterRequest filterRequest = new ProductFilterRequest();

    // Directly use lists, null if empty
    filterRequest.setCategories(
        (categories == null || categories.isEmpty()) ? null : categories
    );
    filterRequest.setBrands(
        (brands == null || brands.isEmpty()) ? null : brands
    );
    filterRequest.setDepartments(
        (departments == null || departments.isEmpty()) ? null : departments
    );

    filterRequest.setMinPrice(minPrice);
    filterRequest.setMaxPrice(maxPrice);
    filterRequest.setSortBy(sortBy);
    filterRequest.setSearchQuery(searchQuery);
    filterRequest.setPage(page);
    filterRequest.setSize(limit);
    

    PaginatedProductResponse response = productService.getFilteredProducts(filterRequest);
    return ResponseEntity.ok(response);
}

    // Endpoint to get available filter options
    @GetMapping("/filters")
    public ResponseEntity<FilterOptionsResponse> getFilterOptions( 
        @RequestParam(value = "q", required = false) String searchQuery) {
    
     FilterOptionsResponse filterOptions;

        if (StringUtils.hasText(searchQuery)) {
    filterOptions = productService.getAvailableFilters(searchQuery);
} else {
    filterOptions = productService.getFilterOptions();
}


         

        return ResponseEntity.ok(filterOptions);
    }

@PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<ProductResponse> createProduct(
        @RequestPart("product") String productJson,                // JSON string
        @RequestPart(value = "files", required = false) List<MultipartFile> files // multiple files
) throws IOException {

    // Convert JSON string to ProductRequest
    ObjectMapper mapper = new ObjectMapper();
    ProductRequest dto = mapper.readValue(productJson, ProductRequest.class);

    // Attach files if provided
    dto.setFiles(files);

    Product saved = productService.createProduct(dto);

    return ResponseEntity.ok(productService.mapToDTO(saved));
}




    @PutMapping("/update/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Validated({OnUpdate.class, Default.class}) @ModelAttribute ProductRequest dto
    ) throws IOException {
        dto.setId(id);
        Product updated = productService.updateProduct(dto);
        return ResponseEntity.ok(productService.mapToDTO(updated));
    }


}
