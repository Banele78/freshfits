package com.freshfits.ecommerce.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;



import com.freshfits.ecommerce.dto.address.AddressRequest;
import com.freshfits.ecommerce.dto.address.AddressResponse;
import com.freshfits.ecommerce.entity.Address;
import com.freshfits.ecommerce.entity.User;
import com.freshfits.ecommerce.jwt.JwtUserPrincipal;
import com.freshfits.ecommerce.repository.UserRepository;
import com.freshfits.ecommerce.service.AddressService;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;
    private final UserRepository userRepository;

    public AddressController(AddressService addressService, UserRepository userRepository) {
        this.addressService = addressService;
        this.userRepository = userRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<AddressResponse> createAddress(
        @RequestBody AddressRequest request,
        @AuthenticationPrincipal JwtUserPrincipal principal
    ) {
        User user = userRepository.findByEmail(principal.email())
            .orElseThrow(() -> new RuntimeException("User not found"));

        AddressResponse savedAddress = addressService.createAddress(request, user);
        return new ResponseEntity<>(savedAddress, HttpStatus.CREATED);
    }

     @GetMapping
public ResponseEntity<List<AddressResponse>> getMyAddresses(
        @AuthenticationPrincipal JwtUserPrincipal principal
) {
    return ResponseEntity.ok(
        addressService.getAddressesForUserId(principal.id())
    );
}

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAddress(
        @PathVariable Long id,
        @AuthenticationPrincipal JwtUserPrincipal principal
    ) {
        addressService.deleteAddress(id, principal.id());
        return ResponseEntity.ok("Address deleted successfully");
    }

    @PutMapping("/update/{id}")
public ResponseEntity<AddressResponse> updateAddress(
        @PathVariable Long id,
        @RequestBody AddressRequest request,
        @AuthenticationPrincipal JwtUserPrincipal principal
) {
    // Principal already contains user info
    User user = userRepository.findById(principal.id())
            .orElseThrow(() -> new RuntimeException("User not found"));

    AddressResponse updatedAddress = addressService.updateAddress(id, request, user);

    return ResponseEntity.ok(updatedAddress);
}


    



}
