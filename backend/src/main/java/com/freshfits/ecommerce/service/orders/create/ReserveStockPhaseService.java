package com.freshfits.ecommerce.service.orders.create;

import java.util.*;

import org.springframework.dao.OptimisticLockingFailureException;

import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.freshfits.ecommerce.dto.order.UnavailableItem;
import com.freshfits.ecommerce.entity.*;
import com.freshfits.ecommerce.exception.*;
import com.freshfits.ecommerce.repository.*;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;


@Service
@RequiredArgsConstructor
public class ReserveStockPhaseService {

    private final ProductsSizesRepository productsSizesRepository;

    @Value("${reservation.expiryMinutes:15}") // default = 15
    private int reservationMinutes;

      /**
     * Creates an order from a user's cart.
     * Optimistic locking & retryable for high concurrency.
     */
@Retryable(
    retryFor = {
        OptimisticLockingFailureException.class},
    maxAttempts = 3,
    backoff = @Backoff(delay = 100, multiplier = 2)
)
@Transactional
public void reserveStockPhase(List<CartItem> items) {
        // determine unavailable items
        List<UnavailableItem> unavailable = new ArrayList<>();

    for (CartItem item : items) {
        ProductsSizes ps = item.getProductSize();

        int updated = productsSizesRepository.reserveStock(
                ps.getId(),
                item.getQuantity()
        );

        if (updated == 1) {
            continue;
        }

        // Only fetch details when reservation fails
        ProductsSizes fresh = productsSizesRepository
                .findByIdWithProduct(ps.getId())
                .orElseThrow();

        unavailable.add(new UnavailableItem(
            ps.getId(),
            item.getQuantity(),
            fresh.getStockQuantity() - fresh.getReservedQuantity()
        ));

        break; // stop early — no point continuing
    }

    if (!unavailable.isEmpty()) {
        // rollback ONLY successful reservations
        throw new ProductStockUnavailableException(
                "Some items are unavailable. Please check your cart.",
                unavailable
        );
    }
}
    
}
