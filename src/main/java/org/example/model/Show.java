package org.example.model;

import javax.persistence.*;
import java.util.*;

@SuppressWarnings("ALL")
@Entity
public class Show {
    @Id
    @GeneratedValue(generator = "userGen", strategy = GenerationType.SEQUENCE)
    private Long show_id;

    @Column
    private String title;

    @Column
    private Integer rating;

    @Column
    private String show_desc;

    @Column
    private String show_type;

    @OneToMany(mappedBy = "show", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "show_actor",
            joinColumns = @JoinColumn(name = "show_id"),
            inverseJoinColumns = @JoinColumn(name = "actor_id")
    )
    private Set<Celebrity> actors = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "director_id")
    private Celebrity director;

    @OneToMany(mappedBy = "show", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Season> seasons = new ArrayList<>();

    public Show() {}

    public Show(String movie_name, String movie_desc) {
        this.title = movie_name;
        this.rating = 0;
        this.show_desc = movie_desc;
    }

    public Long getShow_id() {
        return show_id;
    }

    @ManyToMany(mappedBy = "wishlist")
    private Set<User> wishlistedBy = new HashSet<>();

    public Set<User> getWishlistedBy() {
        return wishlistedBy;
    }

    public Set<Celebrity> getActors() {
        return actors;
    }

    public void setDirector(Celebrity director) {
        this.director = director;
    }

    public Celebrity getDirector() {
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
}
