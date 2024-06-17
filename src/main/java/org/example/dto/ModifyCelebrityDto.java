package org.example.dto;

public class ModifyCelebrityDto {
    private final String id;
    private final String name;
    private final String biography;

    public ModifyCelebrityDto(String id, String name, String biography) {
        this.id = id;
        this.name = name;
        this.biography = biography;
    }

    public Long getId() {
        return Long.parseLong(id);
    }

    public String getName() {
        return name;
    }

    public String getBiography() {
        return biography;
    }
}
