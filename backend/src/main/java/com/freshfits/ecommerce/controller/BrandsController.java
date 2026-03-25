package com.freshfits.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.freshfits.ecommerce.dto.BrandResponse;
import com.freshfits.ecommerce.entity.Brands;
import com.freshfits.ecommerce.repository.BrandsRepository;
import com.freshfits.ecommerce.service.BrandService;

@RestController
@RequestMapping("/api/brands")
public class BrandsController {
      
    @Autowired
    private BrandService brandService;

    // Add methods here for managing brands
   @GetMapping("/all")
   public ResponseEntity<List<BrandResponse>> getAllBrands() {
    List<Brands> brands = brandService.getAllBrands();

    // Map all three fields including active
    List<BrandResponse> brandResponses = brands.stream()
        .map(brand -> {
            BrandResponse br = new BrandResponse();
            br.setId(brand.getId());
            br.setName(brand.getName());
            br.setActive(brand.getStatus()); // <-- make sure your entity has this field
            return br;
        })
        .toList();

    return ResponseEntity.ok(brandResponses);
}

}
