package com.freshfits.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.freshfits.ecommerce.dto.address.AddressResponse;
import com.freshfits.ecommerce.entity.Address;
import com.freshfits.ecommerce.entity.User;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    
    
  
    
    // Find a specific address by ID and user (for authorization)
    Optional<Address> findByIdAndUser(Long id, User user);
    
    @Query("""
    SELECT COUNT(a) > 0
    FROM Address a
    WHERE a.id = :addressId
      AND a.user.id = :userId
""")
boolean existsByIdAndUserId(
    @Param("addressId") Long addressId,
    @Param("userId") Long userId
);

    // Count how many addresses a user has
    long countByUser(User user);

    long countByUserAndIsDeletedFalse(User user);


  @Query("""
   SELECT new com.freshfits.ecommerce.dto.address.AddressResponse(
       a.id,
       a.name,
       a.surname,
       a.companyName,
       a.addressLine1,
       a.addressLine2,
       a.country,
       a.city,
       a.province,
       a.postalCode,
       a.phoneNo,
       a.createdAt,
       a.updatedAt,
       a.isDefault,
       CONCAT(a.addressType)
   )
   FROM Address a
   WHERE a.user.id = :userId AND a.isDeleted = false
   ORDER BY a.createdAt DESC
""")
List<AddressResponse> findAddressResponsesByUserId(@Param("userId") Long userId);

@Transactional
@Modifying
@Query("UPDATE Address a SET a.isDefault = false WHERE a.user = :user AND a.isDefault = true")
void unsetDefaultForUser(@Param("user") User user);

 // Add this method
    Optional<Address> findByIdAndUserId(Long id, Long userId);


}