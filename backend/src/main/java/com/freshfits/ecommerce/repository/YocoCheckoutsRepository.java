package com.freshfits.ecommerce.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.freshfits.ecommerce.entity.YocoCheckouts;

public interface YocoCheckoutsRepository extends JpaRepository<YocoCheckouts, Long> {
   
}

