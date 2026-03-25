package com.freshfits.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.freshfits.ecommerce.dto.ProductfitTypeReponse;
import com.freshfits.ecommerce.service.ProductfitTypeService;

@RestController
@RequestMapping("/api/fit-types")
public class ProductfitTypeController {

    @Autowired
    private ProductfitTypeService productfitTypeService;

    @GetMapping("/all")
    public ResponseEntity<List<ProductfitTypeReponse>> getAllFitTypes() {
        List<ProductfitTypeReponse> fitTypes = productfitTypeService.getAllFitTypes();
        return ResponseEntity.ok(fitTypes);
    }
}