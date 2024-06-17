package org.example.model;

import com.google.gson.*;

import javax.persistence.*;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Celebrity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long celebrityId;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 5000)
    private String bio;

    @Column
    private String image;

    @ManyToMany(mappedBy = "actors")
    private List<Show> actedShows = new ArrayList<>();

    @OneToMany(mappedBy = "director")
    private List<Show> directedShows = new ArrayList<>();

    public Celebrity() {}

    public Celebrity(String name, String bio) {
        this.name = name;
        this.bio = bio;
    }

    public Celebrity(String name, String bio, String objectKey) {
        this.name = name;
        this.bio = bio;
        this.image = "https://cinemunitybucket.s3.amazonaws.com/" + objectKey;
    }

    public String getName() {
        return name;
    }

    public void addDirectedShow(Show show) {
        directedShows.add(show);
    }

    public void addActedShow(Show show) {
        actedShows.add(show);
    }

    public String getId() {
        return celebrityId.toString();
    }

    public String asJson() {
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Celebrity.class, new JsonSerializer<Celebrity>() {
                    @Override
                    public JsonElement serialize(Celebrity src, Type typeOfSrc, JsonSerializationContext context) {
                        JsonObject jsonObject = new JsonObject();
                        jsonObject.addProperty("celebrityId", src.celebrityId);
                        jsonObject.addProperty("name", src.name);
                        jsonObject.addProperty("bio", src.bio);
                        jsonObject.addProperty("image", src.image);

                        JsonArray actedShowsArray = new JsonArray();
                        for (Show show : src.actedShows) {
                            actedShowsArray.add(show.getTitle());
                        }
                        jsonObject.add("actedShows", actedShowsArray);

                        JsonArray directedShowsArray = new JsonArray();
                        for (Show show : src.directedShows) {
                            directedShowsArray.add(show.getTitle());
                        }
                        jsonObject.add("directedShows", directedShowsArray);

                        return jsonObject;
                    }
                })
                .create();

        return gson.toJson(this);
    }

    public void setImage(String objectKey) {
        this.image = "https://cinemunitybucket.s3.amazonaws.com/" + objectKey;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBiography(String biography) {
        this.bio = biography;
    }
}