package com.freshfits.ecommerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.freshfits.ecommerce.entity.Brands;
import com.freshfits.ecommerce.repository.BrandsRepository;

@Service
public class BrandService {

    @Autowired
    private BrandsRepository brandRepository;

    public List<Brands> getAllBrands() {
        return brandRepository.findAll();
    }
}
