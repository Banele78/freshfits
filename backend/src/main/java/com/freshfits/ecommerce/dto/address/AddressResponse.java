package com.freshfits.ecommerce.dto.address;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AddressResponse {

    private Long id;
    private String name;
    private String surname;
    private String companyName;
    private String addressLine1;
    private String addressLine2;
    private String country;
    private String city;
    private String province;
    private String postalCode;
    private String phoneNo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isDefault;
    private String addressType;

      // ✅ No-args constructor for mapToResponse() and serialization
    public AddressResponse() {}

    // ✅ Constructor used by JPQL
    public AddressResponse(
            Long id,
            String name,
            String surname,
            String companyName,
            String addressLine1,
            String addressLine2,
            String country,
            String city,
            String province,
            String postalCode,
            String phoneNo,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            Boolean isDefault,
            String addressType
    ) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.companyName = companyName;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.country = country;
        this.city = city;
        this.province = province;
        this.postalCode = postalCode;
        this.phoneNo = phoneNo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isDefault = isDefault;
        this.addressType = addressType;
    }
}
