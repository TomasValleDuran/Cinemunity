package org.example.dto;

public class PresignedUrlResponseDto {
    private final String url;
    private final String fullObjectKey;

    public PresignedUrlResponseDto(String url, String fullObjectKey) {
        this.url = url;
        this.fullObjectKey = fullObjectKey;
    }

    // getters and setters
    public String getUrl() {
        return url;
    }

    public String getFullObjectKey() {
        return fullObjectKey;
    }
}
