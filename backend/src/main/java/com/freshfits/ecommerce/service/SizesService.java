package com.freshfits.ecommerce.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.freshfits.ecommerce.dto.SizeDto;
import com.freshfits.ecommerce.entity.Sizes;
import com.freshfits.ecommerce.repository.SizesRepository;

@Service
public class SizesService {

    @Autowired
    private SizesRepository sizesRepository;

    // Group by enum → convert key to String, return DTO
    public Map<String, List<SizeDto>> getSizesGroupedByGroupName() {
        List<Sizes> sizes = sizesRepository.findAll();

        return sizes.stream()
                .filter(s -> Boolean.TRUE.equals(s.getStatus()))
                .collect(Collectors.groupingBy(
                        s -> s.getGroupName().name(), // convert enum to string
                        Collectors.mapping(
                                s -> new SizeDto(s.getId(), s.getName()),
                                Collectors.toList()
                        )
                ));
    }
}
