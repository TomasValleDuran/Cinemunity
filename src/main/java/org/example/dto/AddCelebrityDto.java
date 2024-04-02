package org.example.dto;

public class AddCelebrityDto {
    private final String name;
    private final String biography;

    public AddCelebrityDto(String name, String biography) {
        this.name = name;
        this.biography = biography;
    }

    public String getName() {
        return name;
    }

    public String getBiography() {
        return biography;
    }
}
