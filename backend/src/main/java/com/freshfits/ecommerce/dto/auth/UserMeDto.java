package com.freshfits.ecommerce.dto.auth;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UserMeDto {

   
    private String email;
    private String name;
    
}
