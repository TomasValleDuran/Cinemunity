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

    @Column()
    private String bio;

    @Column
    private String celebrityImage;

    @ManyToMany(mappedBy = "actors")
    private List<Show> actedShows = new ArrayList<>();

    @OneToMany(mappedBy = "director")
    private List<Show> directedShows = new ArrayList<>();

    public Celebrity() {}

    public Celebrity(String name, String bio) {
        this.name = name;
        this.bio = bio;
    }

    public String getName() {
        return name;
    }

    public void setCelebrityImage(String celebrityImage) {
        this.celebrityImage = celebrityImage;
    }

    public void addDirectedShow(Show show) {
        directedShows.add(show);
    }

    public void addActedShow(Show show) {
        actedShows.add(show);
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
}