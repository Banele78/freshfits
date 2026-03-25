package com.freshfits.ecommerce.service.orders.create;

import java.util.*;

import org.springframework.stereotype.Service;

import com.freshfits.ecommerce.dto.CheckoutRequest;
import com.freshfits.ecommerce.dto.OrderResponse;

import com.freshfits.ecommerce.entity.*;
import com.freshfits.ecommerce.exception.*;
import com.freshfits.ecommerce.repository.*;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.OptimisticLockingFailureException;


@Service
@RequiredArgsConstructor
public class CreateOrderService {

    private static final Logger log = LoggerFactory.getLogger(CreateOrderService.class);

    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final EntityManager entityManager;
    private final ReserveStockPhaseService reserveStockPhaseService;
    private final CreateOrderPhaseService createOrderPhaseService;


    @Value("${reservation.expiryMinutes:15}") // default = 15
    private int reservationMinutes;

    public OrderResponse createOrder(Long userId, CheckoutRequest request) {

    // Read-only lookups (no locks)
    User user = entityManager.getReference(User.class, userId);
   Address address = entityManager.getReference(Address.class, request.getAddressId());

   boolean addressValid = addressRepository
        .existsByIdAndUserId(request.getAddressId(), userId);

if (!addressValid) {
    throw new AddressNotFoundException("Address does not exist or does not belong to user");
}

    Cart cart = cartRepository.findByUserIdWithItemsMinimal(user.getId())
            .orElseThrow(() -> new CartNotFoundException("Cart not found"));

    if (cart.getItems().isEmpty()) {
        throw new InvalidCartOperationException("Cart is empty");
    }

    // Sort once, reuse everywhere
    List<CartItem> sortedItems = cart.getItems().stream()
            .sorted(Comparator.comparing(ci -> ci.getProductSize().getId()))
            .toList();

      try {
        reserveStockPhaseService.reserveStockPhase(sortedItems);

        Order order = createOrderPhaseService.createOrderPhase(
            user, address, cart, sortedItems, request.getDeliveryMethod(), request.getDeliveryFee()
        );

        return OrderResponse.builder()
                .success(true)
                .message("Order created successfully")
                .orderId(order.getId())
                .build();

    } catch (ProductStockUnavailableException ex) {
        return OrderResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .unavailableProducts(ex.getUnavailableItems())
                .build();

    } catch (OptimisticLockingFailureException ex) {
        return OrderResponse.builder()
                .success(false)
                .message("High demand detected; please try again.")
                .build();

    } catch (Exception ex) {
        log.error("Unexpected error during order creation", ex);
        return OrderResponse.builder()
                .success(false)
                .message("An unexpected error occurred.")
                .build();
    }
}

}
