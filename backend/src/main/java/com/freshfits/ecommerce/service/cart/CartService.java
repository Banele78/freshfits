package com.freshfits.ecommerce.service.cart;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;

import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;

import com.freshfits.ecommerce.dto.cart.CartDTO;
import com.freshfits.ecommerce.dto.cart.CartItemDTO;
import com.freshfits.ecommerce.dto.cart.CartItemDTOProjection;

import com.freshfits.ecommerce.entity.Cart;
import com.freshfits.ecommerce.entity.CartItem;
import com.freshfits.ecommerce.entity.ProductImage;
import com.freshfits.ecommerce.entity.User;
import com.freshfits.ecommerce.exception.CartNotFoundException;
import com.freshfits.ecommerce.exception.InvalidCartOperationException;
import com.freshfits.ecommerce.exception.UserNotFoundException;
import com.freshfits.ecommerce.repository.CartItemRepository;
import com.freshfits.ecommerce.repository.CartRepository;
import com.freshfits.ecommerce.repository.ProductImageRepository;
import com.freshfits.ecommerce.repository.ProductRepository;
import com.freshfits.ecommerce.repository.UserRepository;
import com.freshfits.ecommerce.service.PresignedUrlCache;
import com.freshfits.ecommerce.service.S3StorageService;

@Service
@RequiredArgsConstructor
public class CartService {

    private static final Logger logger = LoggerFactory.getLogger(CartService.class);

    @Value("${cart.low-stock-threshold}")
    private int lowStockThreshold;

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final ModifyCartService modifyCartService;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final S3StorageService s3StorageService;
    private final PresignedUrlCache presignedUrlCache;
    private static final int LOW_STOCK_THRESHOLD = 5;

    public enum CartAction {
        ADD, SUBTRACT, DELETE;
    
        public static CartAction fromString(String action) {
            try {
                return CartAction.valueOf(action.toUpperCase());
            } catch (Exception e) {
                throw new InvalidCartOperationException("Invalid action. Use 'add', 'subtract', or 'delete'");
            }
        }
    }

    @Transactional
    public Cart modifyCartItemByEmail(Long userId, Long productSizeId, Integer quantity, String actionStr) {
       
        return modifyCartService.modifyCartItem(userId, productSizeId, quantity, CartAction.fromString(actionStr));
    }



    
    
         @Transactional(readOnly = true)
public CartDTO getCartDTOByEmail(Long userId) {

    // Fetch cart items via projection
    List<CartItemDTOProjection> projections = cartRepository.findCartItemsByUserId(userId);

    if (projections.isEmpty()) {
        return CartDTO.builder()
                .items(List.of())
                .totalPrice(BigDecimal.ZERO)
                .totalItems(0)
                .hasLowStockItems(false)
                .build();
    }

    // Initialize accumulators
    final boolean[] hasLowStockItems = {false};
    final int[] totalItems = {0};
    final BigDecimal[] totalPrice = {BigDecimal.ZERO};

    // Build DTOs and calculate totals
    List<CartItemDTO> itemDTOs = projections.stream().map(proj -> {
        Integer stockQty = proj.getStockQuantity() - proj.getReservedQuantity();
        int cartQty = proj.getQuantity();
        boolean outOfStock = stockQty == null || stockQty == 0;
        boolean exceedsStock = stockQty != null && cartQty > stockQty;
        boolean isLowStock = stockQty != null && stockQty <= LOW_STOCK_THRESHOLD;

       if (outOfStock || exceedsStock) {
         hasLowStockItems[0] = true;
       }

        String stockMessage = null;

      if (outOfStock) {
        stockMessage = "This item is out of stock";
      } else if (exceedsStock) {
         stockMessage = "Only " + stockQty + " available. Please reduce quantity.";
      } else if (isLowStock) {
         stockMessage = "Only " + stockQty + " left in stock!";
      }

        BigDecimal itemTotal = proj.getUnitPrice().multiply(BigDecimal.valueOf(proj.getQuantity()));
        totalPrice[0] = totalPrice[0].add(itemTotal);
        totalItems[0] += proj.getQuantity();

        // Generate presigned URL using cache
        String imageUrl = null;
        if (proj.getPrimaryImageS3Key() != null) {
            imageUrl = presignedUrlCache.get(proj.getPrimaryImageS3Key(),
                    () -> s3StorageService.generatePresignedUrl(proj.getPrimaryImageS3Key(), Duration.ofHours(1)));
        }

        return CartItemDTO.builder()
                .productId(proj.getProductId())
                .productSizeId(proj.getProductSizeId())
                .productName(proj.getProductName())
                .slug(proj.getProductSlug())
                .size(proj.getSizeName())
                .quantity(proj.getQuantity())
                .unitPrice(proj.getUnitPrice())
                .totalPrice(itemTotal)
                .addedAt(proj.getAddedAt())
                .lowStockMessage(isLowStock ? "Only " + proj.getStockQuantity() + " left in stock!" : null)
                .imageUrl(imageUrl)
                .availableStock(stockQty)
                .outOfStock(outOfStock)
                .exceedsStock(exceedsStock)
                .stockMessage(stockMessage)
                .build();
    }).toList();

    return CartDTO.builder()
            .items(itemDTOs)
            .totalPrice(totalPrice[0])
            .totalItems(totalItems[0])
            .hasLowStockItems(hasLowStockItems[0])
            .build();
}



  


   @Retryable(
    retryFor = OptimisticLockingFailureException.class,
    maxAttempts = 3,
    backoff = @Backoff(delay = 50)
)
@Transactional
public void clearCart(Long userId) {
    Cart cart = cartRepository.findByUserId(userId)
            .orElseThrow(() -> new CartNotFoundException("Cart not found for user: " + userId));

    cartItemRepository.deleteAll(cart.getItems());
    cart.getItems().clear();
    cartRepository.save(cart);

    logger.info("Cleared all items from cart for user {}", userId);
}

}
