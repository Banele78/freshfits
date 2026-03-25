package com.freshfits.ecommerce.service.cart;

import java.time.LocalDateTime;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.freshfits.ecommerce.entity.Cart;
import com.freshfits.ecommerce.entity.CartItem;
import com.freshfits.ecommerce.entity.Product;
import com.freshfits.ecommerce.entity.ProductsSizes;
import com.freshfits.ecommerce.entity.User;
import com.freshfits.ecommerce.exception.InvalidCartOperationException;
import com.freshfits.ecommerce.exception.ProductNotFoundException;
import com.freshfits.ecommerce.exception.UserNotFoundException;
import com.freshfits.ecommerce.repository.CartRepository;
import com.freshfits.ecommerce.repository.ProductRepository;
import com.freshfits.ecommerce.repository.ProductsSizesRepository;
import com.freshfits.ecommerce.repository.UserRepository;
import com.freshfits.ecommerce.service.cart.CartService.CartAction;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ModifyCartService {

     private static final Logger logger = LoggerFactory.getLogger(ModifyCartService.class);

    private final CartRepository cartRepository;
    private final ProductsSizesRepository productsSizesRepository;
    private final UserRepository userRepository;

     @Retryable(
        retryFor = OptimisticLockingFailureException.class,
        maxAttempts = 3,
        backoff = @Backoff(delay = 50)
    )
    @Transactional
    public Cart modifyCartItem(Long userId,Long productSizeId, Integer quantity, CartAction action) {
        ProductsSizes productSize = productsSizesRepository.findById(productSizeId)
    .orElseThrow(() -> new ProductNotFoundException(
        "Product size not found with id: " + productSizeId
    ));
        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> createNewCart(userId));
        if (cart.getItems() == null) cart.setItems(new java.util.ArrayList<>());

        Optional<CartItem> existingItemOpt = findCartItem(cart, productSizeId);

        switch (action) {
            case ADD -> handleAdd(cart, productSize, existingItemOpt, quantity);
            case SUBTRACT -> handleSubtract(cart, existingItemOpt, quantity);
            case DELETE -> handleDelete(cart, existingItemOpt);
        }

        Cart savedCart = cartRepository.save(cart);
        logger.info("Cart modified successfully for userId {} with action {}", userId, action);
        return savedCart;
    }

    @Recover
    public Cart recover(OptimisticLockingFailureException ex, Long userId, Long productSizeId, Integer quantity, CartAction action) {
        logger.error("Failed to modify cart after retries for userId {} and productId {}", userId, productSizeId);
        throw new InvalidCartOperationException("Failed to modify cart due to concurrent updates. Please try again.");
    }

     private Cart createNewCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        Cart newCart = new Cart();
        newCart.setUser(user);
        return cartRepository.save(newCart);
    }

    private Optional<CartItem> findCartItem(Cart cart, Long productSizeId) {
        return cart.getItems().stream()
                .filter(item -> item.getProductSize().getId().equals(productSizeId))
                .findFirst();
    }

     private void handleAdd(Cart cart, ProductsSizes productsSizes, Optional<CartItem> existingItemOpt, Integer quantity) {
        if (quantity == null || quantity <= 0)
            throw new InvalidCartOperationException("Quantity must be greater than 0 to add");

        int currentQty = existingItemOpt.map(CartItem::getQuantity).orElse(0);

        Integer availableStock = productsSizes.getStockQuantity() - productsSizes.getReservedQuantity();

        if (availableStock < currentQty + quantity) {
            throw new InvalidCartOperationException("Not enough stock. Only " +
                    (availableStock - currentQty) + " more available.");
        }

        if (existingItemOpt.isPresent()) {
            CartItem item = existingItemOpt.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setProductSize(productsSizes);
            newItem.setQuantity(quantity);
            newItem.setCart(cart);
            cart.getItems().add(newItem);
        }

        logger.info("Added {} of productId {} to cart (stock checked only)", quantity, productsSizes.getId());
    }

    private void handleSubtract(Cart cart, Optional<CartItem> existingItemOpt, Integer quantity) {
        if (existingItemOpt.isEmpty()) throw new InvalidCartOperationException("Product not found in cart");

        CartItem item = existingItemOpt.get();
        if (quantity == null || quantity <= 0)
            throw new InvalidCartOperationException("Quantity must be greater than 0 to subtract");
        if (item.getQuantity() < quantity)
            throw new InvalidCartOperationException("Cannot subtract more than current quantity: " + item.getQuantity());

        item.setQuantity(item.getQuantity() - quantity);
        if (item.getQuantity() == 0) cart.getItems().remove(item);

        logger.info("Subtracted {} of productId {} from cart", quantity, item.getProductSize().getId());
    }

    private void handleDelete(Cart cart, Optional<CartItem> existingItemOpt) {
        if (existingItemOpt.isEmpty()) throw new InvalidCartOperationException("Product not found in cart to delete");

        CartItem item = existingItemOpt.get();
        cart.getItems().remove(item);

        logger.info("Deleted productId {} from cart", item.getProductSize().getId());
    }

      @Recover
    public Cart recover(Exception ex, Long userId, Long productId, Integer quantity, CartAction action) {
        throw new InvalidCartOperationException(ex.getMessage());
    }

    
}
