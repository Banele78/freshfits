package com.freshfits.ecommerce.dto;

import lombok.Data;

@Data
public class DepartmentResponse {
    private Long id;
    private String name;
    private boolean active;
}
