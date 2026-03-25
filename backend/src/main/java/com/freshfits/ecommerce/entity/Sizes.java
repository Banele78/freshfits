package com.freshfits.ecommerce.entity;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sizes")
public class Sizes {

    public enum SizeGroup {
    NUM, ALP, SHOE, NONE
   }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = false, nullable = false)
    private String name;

    @Builder.Default
    private Boolean status = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "size_group")
    private SizeGroup groupName;

    @Builder.Default
    @OneToMany(mappedBy = "size", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<ProductsSizes> productsSizes = new ArrayList<>();
}
