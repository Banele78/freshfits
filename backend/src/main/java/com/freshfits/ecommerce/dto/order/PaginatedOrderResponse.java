package com.freshfits.ecommerce.dto.order;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaginatedOrderResponse {
    private List<OrderResponse> orders;
    private int currentPage;
    private int totalPages;
    private long totalItems;
    private int pageSize;
}
