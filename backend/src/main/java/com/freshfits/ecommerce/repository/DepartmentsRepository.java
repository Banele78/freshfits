package com.freshfits.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.freshfits.ecommerce.entity.Departments;



@Repository
public interface DepartmentsRepository extends JpaRepository<Departments, Long> {
      Optional<Departments> findByNameIgnoreCase(String name);
}
