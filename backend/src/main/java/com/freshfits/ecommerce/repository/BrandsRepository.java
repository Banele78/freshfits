package com.freshfits.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.freshfits.ecommerce.entity.Brands;


@Repository
public interface BrandsRepository extends JpaRepository<Brands, Long> {
    Optional<Brands> findByNameIgnoreCase(String name);
    
}
