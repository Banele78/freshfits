package com.freshfits.ecommerce.service.products;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.freshfits.ecommerce.dto.product.ProductResponse;
import com.freshfits.ecommerce.entity.Product;
import com.freshfits.ecommerce.entity.ProductImage;
import com.freshfits.ecommerce.entity.ProductsSizes;
import com.freshfits.ecommerce.entity.Review;
import com.freshfits.ecommerce.exception.ProductNotFoundException;
import com.freshfits.ecommerce.repository.ProductImageRepository;
import com.freshfits.ecommerce.repository.ProductRepository;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class ProductDetailsService {

    private final ProductRepository productRepository;
    private final ProductService productService;
    private final ProductImageRepository productImageRepository;

    
@Transactional(readOnly = true)
public ProductResponse getProductBySlug(String slug) {

    Product product = productRepository.findProductWithDetailsBySlug(slug);

    if (product == null) {
        throw new ProductNotFoundException("Product not found with slug: " + slug);
    }

    List<ProductImage> images =
    productImageRepository.findImagesForProducts(List.of(product.getId()));

    product.getImages().clear();
    product.getImages().addAll(images);

    return productService.mapToDTO(product, true);
}

}

