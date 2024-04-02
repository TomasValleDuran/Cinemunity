package org.example.model;

import com.google.gson.Gson;
import com.google.gson.annotations.Expose;

import javax.persistence.*;
import java.util.*;

@SuppressWarnings("ALL")
@Entity
public class Show {
    @Id
    @GeneratedValue(generator = "userGen", strategy = GenerationType.SEQUENCE)
    @Expose
    private Long showId;

    @Expose
    @Column
    private String title;

    @Expose
    @Column
    private Integer rating;

    @Expose
    @Column
    private String show_desc;

    @Expose
    @Column
    private String show_type;

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
        Gson gson = new Gson();
        return gson.toJson(this);
    }


}
