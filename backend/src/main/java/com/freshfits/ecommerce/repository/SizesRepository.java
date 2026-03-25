

package com.freshfits.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.freshfits.ecommerce.entity.Sizes;

@Repository
public interface SizesRepository extends JpaRepository<Sizes, Long> {
    
}
