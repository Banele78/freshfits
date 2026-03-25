package com.freshfits.ecommerce.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.freshfits.ecommerce.dto.address.AddressRequest;
import com.freshfits.ecommerce.dto.address.AddressResponse;
import com.freshfits.ecommerce.entity.Address;
import com.freshfits.ecommerce.entity.User;
import com.freshfits.ecommerce.exception.ResourceNotFoundException;
import com.freshfits.ecommerce.exception.UnauthorizedAccessException;
import com.freshfits.ecommerce.repository.AddressRepository;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;

       @Transactional
public AddressResponse createAddress(AddressRequest request, User user) {
    log.debug("Creating new address for user ID: {}", user.getId());

    // Validate user doesn't exceed address limit
    long addressCount = addressRepository.countByUserAndIsDeletedFalse(user);
    if (addressCount >= 10) {
        throw new IllegalArgumentException("Maximum address limit (10) reached");
    }

    Address address = new Address();
    address.setUser(user);
    address.setName(request.getName());
    address.setSurname(request.getSurname());
    address.setCompanyName(request.getCompanyName());
    address.setAddressLine1(request.getAddressLine1());
    address.setAddressLine2(request.getAddressLine2());
    address.setCountry(request.getCountry());
    address.setCity(request.getCity());
    address.setProvince(request.getProvince());
    address.setPostalCode(request.getPostalCode());
    address.setPhoneNo(request.getPhoneNo());
    address.setAddressType(request.getAddressType() != null 
        ? request.getAddressType() 
        : Address.AddressType.HOME);

    // Handle default address
    boolean isDefault = request.getIsDefault() != null ? request.getIsDefault() : false;
    if (isDefault) {
        // Unset previous default(s)
        addressRepository.unsetDefaultForUser(user);
        address.setIsDefault(true);
    } else {
        address.setIsDefault(false);
    }

    Address saved = addressRepository.save(address);
    log.info("Address created successfully with ID: {} for user ID: {}", saved.getId(), user.getId());

    return mapToResponse(saved);
}

 @Transactional(readOnly = true)
public List<AddressResponse> getAddressesForUserId(Long userId) {
    return addressRepository.findAddressResponsesByUserId(userId);
}


  

    @Transactional
    public AddressResponse updateAddress(Long id, AddressRequest request, User user) {
        log.debug("Updating address with ID: {} for user ID: {}", id, user.getId());
        
        // Find address and verify ownership
        Address address = addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + id));

        // Update fields
        address.setName(request.getName());
        address.setSurname(request.getSurname());
        address.setCompanyName(request.getCompanyName());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCountry(request.getCountry());
        address.setCity(request.getCity());
        address.setProvince(request.getProvince());
        address.setPostalCode(request.getPostalCode());
        address.setPhoneNo(request.getPhoneNo());
         address.setAddressType(request.getAddressType() != null 
        ? request.getAddressType() 
        : Address.AddressType.HOME);

    // Handle default address
    boolean isDefault = request.getIsDefault() != null ? request.getIsDefault() : false;
    if (isDefault) {
        // Unset previous default(s)
        addressRepository.unsetDefaultForUser(user);
        address.setIsDefault(true);
    } else {
        address.setIsDefault(false);
    }

        Address updated = addressRepository.save(address);
        log.info("Address updated successfully with ID: {}", updated.getId());

        return mapToResponse(updated);
    }

  @Transactional
public void deleteAddress(Long id, Long userId) {
    log.debug("Soft deleting address with ID: {} for user ID: {}", id, userId);

    // Fetch the address and verify ownership
    Address address = addressRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + id));

    // Mark as deleted
    address.setIsDeleted(true);
    addressRepository.save(address);

    log.info("Address soft deleted successfully with ID: {}", id);
}


    

  private AddressResponse mapToResponse(Address address) {
    AddressResponse response = new AddressResponse();
    response.setId(address.getId());
    response.setName(address.getName());
    response.setSurname(address.getSurname());
    response.setCompanyName(address.getCompanyName());
    response.setAddressLine1(address.getAddressLine1());
    response.setAddressLine2(address.getAddressLine2());
    response.setCountry(address.getCountry());
    response.setCity(address.getCity());
    response.setProvince(address.getProvince());
    response.setPostalCode(address.getPostalCode());
    response.setPhoneNo(address.getPhoneNo());
    response.setCreatedAt(address.getCreatedAt());
    response.setUpdatedAt(address.getUpdatedAt());
    response.setIsDefault(address.getIsDefault());
    response.setAddressType(address.getAddressType() != null ? address.getAddressType().name() : null);
    return response;
}
}