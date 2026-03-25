package com.freshfits.ecommerce.dto.order;

import com.freshfits.ecommerce.entity.Address.AddressType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShippingAddressResponse {
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String province;
    private String postalCode;
    private String country;
    private String phoneNo;
    private String name;
    private String surname;
    private String companyName;
    private AddressType addressType;
}
