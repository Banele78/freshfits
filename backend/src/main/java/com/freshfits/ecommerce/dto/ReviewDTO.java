package com.freshfits.ecommerce.dto;


import lombok.Data;
import java.time.LocalDateTime;


@Data
public class ReviewDTO {
    
    private Long id;
    private int rating;
    private String comment;
    private String userName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean mine;

      // Constructor for JPQL "new" query
    public ReviewDTO(Long id, int rating, String comment, String userName, LocalDateTime createdAt,LocalDateTime updatedAt,  boolean mine) {
        this.id = id;
        this.rating = rating;
        this.comment = comment;
        this.userName = userName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.mine = mine;
    }

    // Default constructor (optional, but good for deserialization)
    public ReviewDTO() {}
}
