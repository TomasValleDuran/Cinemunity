package org.example.dto;

import java.util.List;

public class AddShowDto {
    private final String title;
    private final String description;
    private final String show_type;
    private final String director;
    private final String seasons;
    private final List<String> actors;
    private final String objectKey;

    public AddShowDto(String title, String description,
                      String show_type, String seasons,
                      String director, List<String> actors,
                      String objectKey) {
        this.title = title;
        this.description = description;
        this.show_type = show_type;
        this.director = director;
        this.seasons = seasons;
        this.actors = actors;
        this.objectKey = objectKey;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getShow_type() {
        return show_type;
    }

    public String getDirector() {
        return director;
    }

    public List<String> getActors() {
        return actors;
    }

    public Integer getSeasons() {
        return seasons.isEmpty() ? null : Integer.parseInt(seasons);
    }

    public String getObjectKey() {
        return objectKey;
    }
}
