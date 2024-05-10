package org.example.dto;

public class AddCelebrityDto {
    private final String name;
    private final String biography;
    private final String objectKey;

    public AddCelebrityDto(String name, String biography, String objectKey) {
        this.name = name;
        this.biography = biography;
        this.objectKey = objectKey;
    }

    public String getName() {
        return name;
    }

    public String getBiography() {
        return biography;
    }

    public String getObjectKey() {
        return objectKey;
    }
}
