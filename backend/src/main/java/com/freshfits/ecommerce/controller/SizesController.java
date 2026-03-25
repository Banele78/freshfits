package com.freshfits.ecommerce.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.freshfits.ecommerce.dto.SizeDto;
import com.freshfits.ecommerce.service.SizesService;

@RestController
@RequestMapping("/api/sizes")
public class SizesController {

    @Autowired
    private SizesService sizesService;

    @GetMapping("/grouped")
    public Map<String, List<SizeDto>> getGroupedSizes() {
        return sizesService.getSizesGroupedByGroupName();
    }
}
