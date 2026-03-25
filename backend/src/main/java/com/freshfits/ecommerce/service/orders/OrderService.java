package com.freshfits.ecommerce.service.orders;

import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.freshfits.ecommerce.dto.order.*;
import com.freshfits.ecommerce.entity.Order;
import com.freshfits.ecommerce.repository.OrderItemRepository;
import com.freshfits.ecommerce.repository.OrderRepository;
import com.freshfits.ecommerce.service.PresignedUrlCache;
import com.freshfits.ecommerce.service.S3StorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final S3StorageService s3StorageService;
    private final PresignedUrlCache presignedUrlCache;

    @Transactional(readOnly = true)
public PaginatedOrderResponse getOrdersWithItems(Long userId, int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
    
    // 1️⃣ Fetch orders (optimized query)
    Page<OrderSummaryDTO> ordersPage = orderRepository.findOrdersWithAddress(userId, pageable);
    
    if (ordersPage.isEmpty()) {
        return buildEmptyResponse(size);
    }
    
    // 2️⃣ Extract order IDs
    List<Long> orderIds = ordersPage.getContent().stream()
            .map(OrderSummaryDTO::id)
            .toList();
    
    // 3️⃣ Fetch order items (optimized query)
    List<OrderItemDTO> items = orderItemRepository.findOrderItemsWithPrimaryImages(orderIds);
    
    // 4️⃣ Batch generate all presigned URLs
    Set<String> imageKeys = items.stream()
            .map(OrderItemDTO::imageKey)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());
    
    Map<String, String> presignedUrls = imageKeys.isEmpty() ? 
            Collections.emptyMap() : 
            generateBatchPresignedUrls(imageKeys);
    
    // 5️⃣ Map items by order ID with pre-generated URLs
    Map<Long, List<OrderItemResponse>> itemsMap = items.parallelStream()
            .collect(Collectors.groupingBy(
                OrderItemDTO::orderId,
                Collectors.mapping(dto -> OrderItemResponse.builder()
                    .productId(dto.productId())
                    .name(dto.productName())
                    .slug(dto.productSlug())
                    .quantity(dto.quantity())
                    .price(dto.price())
                    .imageUrl(dto.imageKey() != null ? presignedUrls.get(dto.imageKey()) : null)
                    .build(), Collectors.toList())
            ));
    
    // 6️⃣ Build final response in parallel
    List<OrderResponse> orderResponses = ordersPage.getContent().parallelStream()
            .map(order -> buildOrderResponse(order, itemsMap))
            .collect(Collectors.toList());
    
    return PaginatedOrderResponse.builder()
            .orders(orderResponses)
            .currentPage(ordersPage.getNumber())
            .totalPages(ordersPage.getTotalPages())
            .totalItems(ordersPage.getTotalElements())
            .pageSize(ordersPage.getSize())
            .build();
}

private Map<String, String> generateBatchPresignedUrls(Set<String> imageKeys) {
    return imageKeys.stream()
        .collect(Collectors.toMap(
            key -> key,
            key -> presignedUrlCache.get(
                key,
                () -> s3StorageService.generatePresignedUrl(key, Duration.ofHours(24))
            )
        ));
}

private OrderResponse buildOrderResponse(OrderSummaryDTO order, Map<Long, List<OrderItemResponse>> itemsMap) {
    ShippingAddressResponse shippingAddress = ShippingAddressResponse.builder()
            .addressLine1(order.addressLine1())
            .addressLine2(order.addressLine2())
            .city(order.city())
            .province(order.province())
            .postalCode(order.postalCode())
            .country(order.country())
            .phoneNo(order.phoneNo())
            .name(order.name())
            .surname(order.surname())
            .companyName(order.companyName())
            .addressType(order.addressType())
            .build();

    // Get the items for this order
    List<OrderItemResponse> orderItems = itemsMap.getOrDefault(order.id(), List.of());

    // Calculate total number of items
   // Calculate total number of items
int totalItemsCount = orderItems.stream()
    .mapToInt(item -> item.getQuantity()) // use getQuantity() from Lombok
    .sum();



    return OrderResponse.builder()
            .id(order.id())
            .orderNumber(order.orderNumber())
            .totalAmount(order.totalAmount())
            .status(order.status())
            .createdAt(order.createdAt())
            .deliveryFee(order.deliveryFee())
            .subtotalAmount(order.subtotalAmount())
            .yocoCheckoutUrl(order.yocoCheckoutUrl())
            .shippingAddress(shippingAddress)
            .items(orderItems)
            .totalItemsCount(totalItemsCount) // Add this field to your DTO
            .deliveryMethod(order.deliveryMethod())
            .deliveryDate(order.deliveryDate())
            .build();
}

private PaginatedOrderResponse buildEmptyResponse(int size) {
    return PaginatedOrderResponse.builder()
            .orders(List.of())
            .currentPage(0)
            .totalPages(0)
            .totalItems(0)
            .pageSize(size)
            .build();
}


      public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
    }


    @Transactional(readOnly = true)
public OrderResponse getOrderById(Long userId, String orderNumber) {

    // 1️⃣ Fetch order summary
    OrderSummaryDTO order = orderRepository
            .findOrderByIdWithAddress(userId, orderNumber)
            .orElseThrow(() -> new RuntimeException("Order not found"));

    // 2️⃣ Fetch order items
    List<OrderItemDTO> items = orderItemRepository
            .findOrderItemsWithPrimaryImages(List.of(order.id()));

    // 3️⃣ Generate presigned URLs
    Set<String> imageKeys = items.stream()
            .map(OrderItemDTO::imageKey)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());

    Map<String, String> presignedUrls = imageKeys.isEmpty()
            ? Collections.emptyMap()
            : generateBatchPresignedUrls(imageKeys);

    // 4️⃣ Map items
    List<OrderItemResponse> orderItems = items.stream()
            .map(dto -> OrderItemResponse.builder()
                    .productId(dto.productId())
                    .name(dto.productName())
                    .slug(dto.productSlug())
                    .quantity(dto.quantity())
                    .price(dto.price())
                    .imageUrl(dto.imageKey() != null ? presignedUrls.get(dto.imageKey()) : null)
                    .size(dto.size())
                    .build())
            .toList();

    // 5️⃣ Calculate total quantity
    int totalItemsCount = orderItems.stream()
            .mapToInt(OrderItemResponse::getQuantity)
            .sum();

    // 6️⃣ Build shipping address
    ShippingAddressResponse shippingAddress = ShippingAddressResponse.builder()
            .addressLine1(order.addressLine1())
            .addressLine2(order.addressLine2())
            .city(order.city())
            .province(order.province())
            .postalCode(order.postalCode())
            .country(order.country())
            .phoneNo(order.phoneNo())
            .name(order.name())
            .surname(order.surname())
            .companyName(order.companyName())
            .addressType(order.addressType())
            .build();

    // 7️⃣ Build response
    return OrderResponse.builder()
            .id(order.id())
            .orderNumber(order.orderNumber())
            .totalAmount(order.totalAmount())
            .status(order.status())
            .createdAt(order.createdAt())
            .deliveryFee(order.deliveryFee())
            .subtotalAmount(order.subtotalAmount())
            .yocoCheckoutUrl(order.yocoCheckoutUrl())
            .shippingAddress(shippingAddress)
            .items(orderItems)
            .totalItemsCount(totalItemsCount)
            .deliveryMethod(order.deliveryMethod())
            .deliveryDate(order.deliveryDate())
            .build();
}

}
