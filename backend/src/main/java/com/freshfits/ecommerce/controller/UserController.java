package com.freshfits.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.freshfits.ecommerce.dto.auth.UserMeDto;
import com.freshfits.ecommerce.exception.UserNotFoundException;
import com.freshfits.ecommerce.jwt.JwtUserPrincipal;
import com.freshfits.ecommerce.repository.UserRepository;

import jakarta.servlet.http.HttpServletResponse;


@RestController
@RequestMapping("/api/me")

public class UserController {

      private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
public ResponseEntity<?> me(@AuthenticationPrincipal JwtUserPrincipal principal) {
    if (principal == null) {
        return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).build();
    }

     UserMeDto userMe = UserMeDto.builder()
                .email(principal.email())
                .name(principal.name())
                .build();
            return ResponseEntity.ok(userMe);
       
}
    
}
