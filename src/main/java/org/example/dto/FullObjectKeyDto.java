package org.example.dto;

public class FullObjectKeyDto {
    private final String fullObjectKey;
    private final String id;

    public FullObjectKeyDto(String fullObjectKey, String id) {
        this.fullObjectKey = fullObjectKey;
        this.id = id;
    }

    public String getFullObjectKey() {
        return fullObjectKey;
    }

    public Long getId() {
        return Long.valueOf(id);
    }
}
