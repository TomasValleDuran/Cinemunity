package org.example.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@SuppressWarnings("ALL")
@Entity
public class Review {
    @Id
    @GeneratedValue(generator = "userGen", strategy = GenerationType.SEQUENCE)
    private Long review_id;

    @Column()
    private String review_text;

    @Column()
    private Integer review_rating;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @ManyToMany(mappedBy = "likes")
    private Set<User> likedBy = new HashSet<>();

    public Review() {}

    public Review(User user, Movie movie,String review_text, Integer review_rating) {
        this.user = user;
        this.movie = movie;
        this.review_text = review_text;
        this.review_rating = review_rating;
    }

    public Long getReview_id() {
        return review_id;
    }
}
