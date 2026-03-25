package com.freshfits.ecommerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.freshfits.ecommerce.entity.Departments;
import com.freshfits.ecommerce.repository.DepartmentsRepository;

@Service
public class DepartmentService {


    @Autowired
    private DepartmentsRepository departmentRepository;

    public List<Departments> getAllDepartments() {
        return departmentRepository.findAll();
    }
    
}
