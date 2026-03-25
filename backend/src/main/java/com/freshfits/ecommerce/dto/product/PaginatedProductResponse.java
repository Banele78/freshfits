package com.freshfits.ecommerce.dto.product;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedProductResponse {
    private List<ProductResponse> products;
    private int currentPage;
    private int totalPages;
    private long totalItems;
    private int pageSize;
    private FilterOptionsResponse filterOptions;
}
