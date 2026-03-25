package com.freshfits.ecommerce.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.freshfits.ecommerce.entity.Category;
import com.freshfits.ecommerce.repository.CategoryRepository;

import org.springframework.http.HttpStatus;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;


public Category saveCategory(Category category) {
    Optional<Category> existingCategory = categoryRepository.findByNameIgnoreCase(category.getName());

    if (existingCategory.isPresent()) {
        throw new ResponseStatusException(
            HttpStatus.CONFLICT, "Category '" + category.getName() + "' already exists"
        );
    }

    if (category.getStatus() == null) {
        category.setStatus(true);
    }

    return categoryRepository.save(category);
}

public List<Category> getAllCategories() {
    return categoryRepository.findAll();  
}  

}

