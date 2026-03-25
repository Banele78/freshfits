package com.freshfits.ecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class S3StorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    private static final String BUCKET_NAME = "freshfits-images";
    private static final String FOLDER = "products/";

public List<String> uploadImages(List<MultipartFile> files) throws IOException {
    if (files == null || files.isEmpty()) throw new IllegalArgumentException("Files must not be null or empty");

    List<String> keys = new ArrayList<>();
    for (MultipartFile file : files) {
        String key = FOLDER + UUID.randomUUID() + "-" + sanitizeFilename(file.getOriginalFilename());

        var request = PutObjectRequest.builder()
                .bucket(BUCKET_NAME)
                .key(key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(request, software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes()));
        keys.add(key);
    }
    return keys;
}

    public String generatePresignedUrl(String key, Duration duration) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(BUCKET_NAME)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(duration)
                .getObjectRequest(getObjectRequest)
                .build();

        return s3Presigner.presignGetObject(presignRequest).url().toString();
    }

    private String sanitizeFilename(String original) {
        if (original == null) return "file";
        return original.replaceAll("[^A-Za-z0-9._-]", "_");
    }
}
