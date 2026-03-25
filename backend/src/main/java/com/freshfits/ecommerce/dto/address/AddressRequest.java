package com.freshfits.ecommerce.dto.address;

import com.freshfits.ecommerce.entity.Address;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AddressRequest {
    
    @NotBlank(message = "Name is required")
    @Size(max = 250, message = "Name must not exceed 250 characters")
    private String name;

    @NotBlank(message = "Surname is required")
    @Size(max = 250, message = "Surname must not exceed 250 characters")
    private String surname;

    @Size(max = 255, message = "Company name must not exceed 255 characters")
    private String companyName;

    @NotBlank(message = "Address line 1 is required")
    @Size(max = 255, message = "Address line 1 must not exceed 255 characters")
    private String addressLine1;

    @Size(max = 255, message = "Address line 2 must not exceed 255 characters")
    private String addressLine2;

    @NotBlank(message = "Country is required")
    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @NotBlank(message = "Province is required")
    @Size(max = 100, message = "Province must not exceed 100 characters")
    private String province;

    @NotBlank(message = "Postal code is required")
    @Size(max = 20, message = "Postal code must not exceed 20 characters")
    private String postalCode;

    private Boolean isDefault;

     @NotNull(message = "Address type is required")
    private Address.AddressType addressType;


@NotBlank(message = "Phone number is required")
@Pattern(
    regexp = "^(\\+\\d{1,3}[- ]?)?\\d{6,14}([ -]?\\d{1,4})*$",
    message = "Invalid phone number format"
)
private String phoneNo;

}