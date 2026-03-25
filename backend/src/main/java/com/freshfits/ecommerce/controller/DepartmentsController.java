package com.freshfits.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.freshfits.ecommerce.dto.BrandResponse;
import com.freshfits.ecommerce.dto.DepartmentResponse;
import com.freshfits.ecommerce.entity.Brands;
import com.freshfits.ecommerce.entity.Departments;
import com.freshfits.ecommerce.service.DepartmentService;

@RestController
@RequestMapping("/api/departments")
public class DepartmentsController {

    @Autowired
    private DepartmentService departmentService;
@GetMapping("/all")
public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
    List<Departments> departments = departmentService.getAllDepartments();

    // Map all three fields including active
    List<DepartmentResponse> departmentResponses = departments.stream()
        .map(department -> {
            DepartmentResponse dr = new DepartmentResponse();
            dr.setId(department.getId());
            dr.setName(department.getName());
            dr.setActive(department.getStatus()); // <-- make sure your entity has this field
            return dr;
        })
        .toList();

    return ResponseEntity.ok(departmentResponses);
}
           




    
}
