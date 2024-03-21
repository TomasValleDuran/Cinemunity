package org.example.model;

import javax.persistence.*;
import java.util.*;

@SuppressWarnings("ALL")
@Entity
public class Movie {
    @Id
    @GeneratedValue(generator = "userGen", strategy = GenerationType.SEQUENCE)
    private Long movie_id;

    @Column
    private String movie_name;

    @Column
    private Integer movie_rating;

    @Column
    private String movie_desc;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    public Movie() {}

    public Movie(String movie_name, String movie_desc) {
        this.movie_name = movie_name;
        this.movie_rating = 0;
        this.movie_desc = movie_desc;
    }

    public Long getMovie_id() {
        return movie_id;
    }

    @ManyToMany(mappedBy = "wishlist")
    private Set<User> wishlistedBy = new HashSet<>();

    public Set<User> getWishlistedBy() {
        return wishlistedBy;
    }
}
