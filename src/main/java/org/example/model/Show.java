package org.example.model;

import com.google.gson.*;

import javax.persistence.*;
import java.lang.reflect.Type;
import java.util.*;

@SuppressWarnings("ALL")
@Entity
public class Show {
    @Id
    @GeneratedValue(generator = "userGen", strategy = GenerationType.SEQUENCE)
    private Long showId;

    @Column
    private String title;

    @Column
    private Integer rating;

    @Column (length = 1500)
    private String show_desc;

    @Column
    private String show_type;

    @Column
    private String image;

    @OneToMany(mappedBy = "show", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "show_actor",
            joinColumns = @JoinColumn(name = "showId"),
            inverseJoinColumns = @JoinColumn(name = "actorId")
    )
    private List<Celebrity> actors = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "directorId")
    private Celebrity director;
    @ManyToMany(mappedBy = "wishlist")
    private List<User> wishlistedBy = new ArrayList<>();

    @OneToMany(mappedBy = "show", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Season> seasons = new ArrayList<>();


    public Show() {}

    public Show(String movie_name, String movie_desc, String show_type, String objectKey) {
        this.title = movie_name;
        this.rating = 0;
        this.show_desc = movie_desc;
        this.show_type = show_type;
        this.image = "https://cinemunitybucket.s3.amazonaws.com/" + objectKey;
    }

    public Show(String movie_name, String movie_desc, String show_type) {
        this.title = movie_name;
        this.rating = 0;
        this.show_desc = movie_desc;
        this.show_type = show_type;
    }

    public Long getShowId() {
        return showId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public void setShow_desc(String show_desc) {
        this.show_desc = show_desc;
    }

    public void setActors(List<Celebrity> actors) {
        this.actors = actors;
    }

    public List<Celebrity> getActors() {
        return actors;
    }

    public void setDirector(Celebrity director) {
        this.director = director;
    }

    public Celebrity getDirectorId() {
        return director;
    }

    public void addSeason(Season season) {
        seasons.add(season);
        season.setShow(this);
    }

    public void removeSeason(Season season) {
        seasons.remove(season);
        season.setShow(null);
    }

    public String asJson() {
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Show.class, new JsonSerializer<Show>() {
                    @Override
                    public JsonElement serialize(Show src, Type typeOfSrc, JsonSerializationContext context) {
                        JsonObject jsonObject = new JsonObject();
                        jsonObject.addProperty("showId", src.showId);
                        jsonObject.addProperty("title", src.title);
                        jsonObject.addProperty("rating", src.rating);
                        jsonObject.addProperty("show_desc", src.show_desc);
                        jsonObject.addProperty("show_type", src.show_type);
                        jsonObject.addProperty("image", src.image);

                        JsonArray reviewsArray = new JsonArray();
                        for (Review review : src.reviews) {
                            reviewsArray.add(review.getReviewId());
                        }
                        jsonObject.add("reviews", reviewsArray);

                        JsonArray actorsArray = new JsonArray();
                        for (Celebrity actor : src.actors) {
                            actorsArray.add(actor.getName());
                        }
                        jsonObject.add("actors", actorsArray);

                        jsonObject.addProperty("director", src.director.getName());

                        JsonArray seasonsArray = new JsonArray();
                        for (Season season : src.seasons) {
                            seasonsArray.add(season.getSeasonNumber());
                        }
                        jsonObject.add("seasons", seasonsArray);

                        return jsonObject;
                    }
                })
                .create();

        return gson.toJson(this);
    }

    public void setImage(String objectKey) {
        this.image = "https://cinemunitybucket.s3.amazonaws.com/" + objectKey;
    }
}
