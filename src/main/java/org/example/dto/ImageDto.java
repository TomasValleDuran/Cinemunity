package org.example.dto;

public class ImageDto {
    private final String folder;
    private final String objectKey;

    public ImageDto(String folder, String objectKey) {
        this.folder = folder;
        this.objectKey = objectKey;
    }

    public String getFolder() {
        return folder;
    }

    public String getObjectKey() {
        return objectKey;
    }
}
