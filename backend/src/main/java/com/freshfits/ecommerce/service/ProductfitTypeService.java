package com.freshfits.ecommerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.freshfits.ecommerce.dto.ProductfitTypeReponse;
import com.freshfits.ecommerce.repository.ProductfitTypeRepository;

@Service
public class ProductfitTypeService {

    @Autowired
    private ProductfitTypeRepository productfitTypeRepository;

    public List<ProductfitTypeReponse> getAllFitTypes() {
        return productfitTypeRepository.findAll()
            .stream()
            .map(fitType -> {
                ProductfitTypeReponse response = new ProductfitTypeReponse();
                response.setId(fitType.getId());
                response.setName(fitType.getName());
                return response;
            })
            .toList();
    }
    
}
