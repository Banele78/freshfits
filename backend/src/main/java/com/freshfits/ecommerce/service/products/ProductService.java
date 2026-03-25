package com.freshfits.ecommerce.service.products;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.multipart.MultipartFile;

import com.freshfits.ecommerce.dto.BrandResponse;
import com.freshfits.ecommerce.dto.DepartmentResponse;
import com.freshfits.ecommerce.dto.ProductSizesReponse;
import com.freshfits.ecommerce.dto.ReviewDTO;
import com.freshfits.ecommerce.dto.product.FilterOptionsResponse;
import com.freshfits.ecommerce.dto.product.OnCreate;
import com.freshfits.ecommerce.dto.product.OnUpdate;
import com.freshfits.ecommerce.dto.product.PaginatedProductResponse;
import com.freshfits.ecommerce.dto.product.ProductFilterRequest;
import com.freshfits.ecommerce.dto.product.ProductListDTO;
import com.freshfits.ecommerce.dto.product.ProductRequest;
import com.freshfits.ecommerce.dto.product.ProductResponse;
import com.freshfits.ecommerce.dto.product.SizeStockRequest;
import com.freshfits.ecommerce.entity.Brands;
import com.freshfits.ecommerce.entity.Category;
import com.freshfits.ecommerce.entity.Departments;
import com.freshfits.ecommerce.entity.Product;
import com.freshfits.ecommerce.entity.ProductImage;
import com.freshfits.ecommerce.entity.ProductfitType;
import com.freshfits.ecommerce.entity.ProductsSizes;
import com.freshfits.ecommerce.entity.Sizes;
import com.freshfits.ecommerce.exception.BrandNotFoundException;
import com.freshfits.ecommerce.exception.CategoryNotFoundException;
import com.freshfits.ecommerce.exception.DepartmentNotFoundException;
import com.freshfits.ecommerce.exception.FitTypeNotFoundException;
import com.freshfits.ecommerce.exception.ProductNotFoundException;
import com.freshfits.ecommerce.repository.BrandsRepository;
import com.freshfits.ecommerce.repository.CategoryRepository;
import com.freshfits.ecommerce.repository.DepartmentsRepository;
import com.freshfits.ecommerce.repository.ProductImageRepository;
import com.freshfits.ecommerce.repository.ProductRepository;
import com.freshfits.ecommerce.repository.ProductfitTypeRepository;
import com.freshfits.ecommerce.repository.SizesRepository;
import com.freshfits.ecommerce.service.PresignedUrlCache;
import com.freshfits.ecommerce.service.S3StorageService;
import com.freshfits.ecommerce.util.SlugUtil;

import org.springframework.util.StringUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.dao.DataIntegrityViolationException;

import jakarta.persistence.criteria.Predicate;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;



@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandsRepository brandsRepository;
    private final DepartmentsRepository departmentRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductfitTypeRepository productfitTypeRepository;
    private final SizesRepository sizesRepository;
    private final S3StorageService s3StorageService;
    private final PresignedUrlCache presignedUrlCache;

    /* -------------------- WRITE OPERATIONS -------------------- */

    @CacheEvict(value = {
    "filterOptions",
    "AvailablefilterOptions"
    }, allEntries = true)
    public Product createProduct(@Validated(OnCreate.class) ProductRequest dto) throws IOException {
        Product product = new Product();
        product.setActive(true);
        String baseSlug = SlugUtil.toSlug(dto.getName());
        String uniqueSlug = generateUniqueSlug(baseSlug);

      product.setSlug(uniqueSlug);

       try {
        return persistProduct(dto, product, false);
    } catch (DataIntegrityViolationException ex) {
        // retry once with timestamp suffix
        product.setSlug(baseSlug + "-" + System.currentTimeMillis());
        return persistProduct(dto, product, false);
    }
    }

    private String generateUniqueSlug(String baseSlug) {
    String slug = baseSlug;
    int counter = 1;

    while (productRepository.existsBySlug(slug)) {
        slug = baseSlug + "-" + counter++;
    }

    return slug;
   }


    @Transactional
    @Caching(evict = {
   
    @CacheEvict(value = "filterOptions", allEntries = true)
    })
    public Product updateProduct(@Validated(OnUpdate.class) ProductRequest dto) throws IOException {
        Product product = productRepository.findById(dto.getId())
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        return persistProduct(dto, product, true);
    }

    /* -------------------- READ OPERATIONS -------------------- */

    public PaginatedProductResponse getFilteredProducts(ProductFilterRequest filterRequest) {

        Pageable pageable = PageRequest.of(
                filterRequest.getPage(),
                filterRequest.getSize(),
                buildSortCriteria(filterRequest.getSortBy())
        );

        Page<ProductListDTO> page = productRepository.findFilteredProducts(
                filterRequest.getCategories(),
                filterRequest.getBrands(),
                filterRequest.getDepartments(),
                filterRequest.getMinPrice(),
                filterRequest.getMaxPrice(),
                filterRequest.getSearchQuery(),
                pageable
        );

        if (page.isEmpty()) {
            return PaginatedProductResponse.builder()
                    .products(List.of())
                    .currentPage(0)
                    .totalPages(0)
                    .totalItems(0)
                    .pageSize(filterRequest.getSize())
                    .build();
        }

        List<Long> productIds = page.getContent().stream()
                .map(ProductListDTO::id)
                .toList();

        Map<Long, List<String>> imageMap =
                productImageRepository.findImagesForProducts(productIds)
                        .stream()
                        .collect(Collectors.groupingBy(
                                img -> img.getProduct().getId(),
                                Collectors.mapping(
                                        img -> presignedUrlCache.get(
                                                img.getS3Key(),
                                                () -> s3StorageService.generatePresignedUrl(
                                                        img.getS3Key(),
                                                        Duration.ofHours(1)
                                                )
                                        ),
                                        Collectors.toList()
                                )
                        ));

        List<ProductResponse> responses = page.getContent().stream().map(p -> {
            ProductResponse resp = new ProductResponse();
            resp.setId(p.id());
            resp.setName(p.name());
            resp.setPrice(p.price());
            resp.setBrand(p.brand());
            resp.setCategory(p.category());
            resp.setDepartment(p.department());
            resp.setFitType(p.fitType());
            resp.setImageUrls(imageMap.getOrDefault(p.id(), List.of()));
            resp.setSlug(p.slug());
            return resp;
        }).toList();

        return PaginatedProductResponse.builder()
                .products(responses)
                .currentPage(page.getNumber())
                .totalPages(page.getTotalPages())
                .totalItems(page.getTotalElements())
                .pageSize(page.getSize())
                .build();
    }

    @Cacheable("filterOptions")
    public FilterOptionsResponse getFilterOptions() {

        FilterOptionsResponse response = new FilterOptionsResponse();

        List<Object[]> rows = productRepository.findAllDistinctFilterValues();

        response.setCategories(rows.stream().map(r -> (String) r[0]).filter(v -> v != null).distinct().toList());
        response.setBrands(rows.stream().map(r -> (String) r[1]).filter(v -> v != null).distinct().toList());
        response.setDepartments(rows.stream().map(r -> (String) r[2]).filter(v -> v != null).distinct().toList());

        Object[] minMax = productRepository.findMinAndMaxPrice().get(0);
        response.setMinPrice(minMax[0] != null ? new BigDecimal(minMax[0].toString()) : BigDecimal.ZERO);
        response.setMaxPrice(minMax[1] != null ? new BigDecimal(minMax[1].toString()) : BigDecimal.ZERO);

        return response;
    }

    @Cacheable(
     value = "AvailablefilterOptions",
     key = "#searchQuery == null ? 'ALL' : #searchQuery.toLowerCase()"
    )
    public FilterOptionsResponse getAvailableFilters(String searchQuery) {

    FilterOptionsResponse response = new FilterOptionsResponse();

    List<Long> allMatchingProductIds = productRepository.findFilteredProductIds(
           searchQuery
       );

       if (allMatchingProductIds.isEmpty()) {
    response.setMinPrice(BigDecimal.ZERO);
    response.setMaxPrice(BigDecimal.ZERO);
    return response;
       }

      List<Object[]> rows = productRepository.findDistinctFilterValuesByProductIds(allMatchingProductIds);

        response.setCategories(rows.stream().map(r -> (String) r[0]).filter(v -> v != null).distinct().toList());
        response.setBrands(rows.stream().map(r -> (String) r[1]).filter(v -> v != null).distinct().toList());
        response.setDepartments(rows.stream().map(r -> (String) r[2]).filter(v -> v != null).distinct().toList());

        Object[] minMax = productRepository.findMinAndMaxPriceByProductIds(allMatchingProductIds).get(0);
        response.setMinPrice(minMax[0] != null ? new BigDecimal(minMax[0].toString()) : BigDecimal.ZERO);
        response.setMaxPrice(minMax[1] != null ? new BigDecimal(minMax[1].toString()) : BigDecimal.ZERO);

        return response;
      }





    /* -------------------- HELPERS -------------------- */

    private Sort buildSortCriteria(String sortBy) {
        return switch (sortBy) {
            case "price-low" -> Sort.by(Sort.Direction.ASC, "price");
            case "price-high" -> Sort.by(Sort.Direction.DESC, "price");
            default -> Sort.by(Sort.Direction.ASC, "createdAt");
        };
    }

    /* -------------------- Helpers -------------------- */

    // Overload for existing usages that expect a single-argument mapper
    public ProductResponse mapToDTO(Product product) {
        return mapToDTO(product, false);
    }



    public ProductResponse mapToDTO(Product product, boolean includeExtra) {
        ProductResponse dto = new ProductResponse();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setImageUrls(
        product.getImages().stream()
        .map(img -> presignedUrlCache.get(
            img.getS3Key(),
            () -> s3StorageService.generatePresignedUrl(
                img.getS3Key(),
                Duration.ofHours(1)
            )
        ))
        .collect(Collectors.toList())
);

        dto.setWeight(product.getWeight());
        dto.setActive(product.isActive());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        dto.setCategory(product.getCategory() != null ? product.getCategory().getName() : null); // or map to a CategoryDTO if you prefer decoupling
        
  
        if (includeExtra) {
        //       List<ReviewDTO> reviews = product.getReviews().stream().map(review -> {
        //     ReviewDTO r = new ReviewDTO();
        //     r.setId(review.getId());
        //     r.setRating(review.getRating());
        //     r.setComment(review.getComment());
        //     r.setCreatedAt(review.getCreatedAt());
        //     r.setUserName(review.getUser() != null ? review.getUser().getName() : "Anonymous");
        //     return r;
        // }).collect(Collectors.toList());
        // dto.setReviews(reviews);

          List<ProductSizesReponse> productSizesDtos = product.getProductsSizes().stream().map(ps -> {
            ProductSizesReponse psDto = new ProductSizesReponse();
            psDto.setId(ps.getId());
            psDto.setSize(ps.getSize().getName());
            psDto.setStockQuantity(ps.getStockQuantity() - ps.getReservedQuantity());
            return psDto;
        }).collect(Collectors.toList());
        dto.setProductsSizes(productSizesDtos);
        
       // ✅ Derived stock
        dto.setStockQuantity(
        product.getProductsSizes()
        .stream()
        .mapToInt(ps -> ps.getStockQuantity() - ps.getReservedQuantity())
        .sum()
         );   
        }
    
        dto.setBrand(product.getBrand() != null ? product.getBrand().getName() : null);

        dto.setDepartment(product.getDepartment() != null ? product.getDepartment().getName() : null);

      

        if(product.getFitType() != null) {
            dto.setFitType(product.getFitType().getName());
        }

        if(product.getSlug() !=null){
            dto.setSlug(product.getSlug());
        }

        return dto;
    }

    private Product persistProduct(ProductRequest dto, Product product, boolean isUpdate) throws IOException {
    // Category required only on create
    if (!isUpdate || dto.getCategoryId() != null) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException(dto.getCategoryId()));
        product.setCategory(category);
    }

    if (dto.getBrandId() != null) {
        Brands brand = brandsRepository.findById(dto.getBrandId())
                .orElseThrow(() -> new BrandNotFoundException(dto.getBrandId()));
        product.setBrand(brand);
    }
    if (dto.getDepartmentId() != null) {
        Departments department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new DepartmentNotFoundException(dto.getDepartmentId()));
        product.setDepartment(department);
    }

    if( dto.getFitTypeId() != null) {
        ProductfitType fitType = productfitTypeRepository.findById(dto.getFitTypeId())
                .orElseThrow(() -> new FitTypeNotFoundException(dto.getFitTypeId()));
        product.setFitType(fitType);
    }

    if (dto.getName() != null) product.setName(dto.getName());
    if (dto.getDescription() != null) product.setDescription(dto.getDescription());
    if (dto.getPrice() != null) product.setPrice(dto.getPrice());
    // 🔥 HANDLE SIZES CORRECTLY
    if (dto.getSizes() != null) {
        product.getProductsSizes().clear(); // important for updates

        for (SizeStockRequest s : dto.getSizes()) {
            Sizes size = sizesRepository.findById(s.getSizeId())
                    .orElseThrow(() -> new RuntimeException("Size not found"));

            ProductsSizes ps = ProductsSizes.builder()
                    .product(product)
                    .size(size)
                    .stockQuantity(s.getStockQuantity())
                    .build();

            product.getProductsSizes().add(ps);
        }
    }


     MultipartFile[] files = dto.getFiles() != null ? dto.getFiles().toArray(new MultipartFile[0]) : null;

if (files != null && files.length > 0) {
    List<String> keys = s3StorageService.uploadImages(Arrays.asList(files));

    // Remove old images for update
    product.getImages().clear();

    for (int i = 0; i < keys.size(); i++) {
        ProductImage img = ProductImage.builder()
                .product(product)
                .s3Key(keys.get(i))
                .isPrimary(i == 0) // first image is primary
                .build();
        product.getImages().add(img);
    }
}
    return productRepository.save(product);
}


     
}
