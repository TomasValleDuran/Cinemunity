package org.example.model;

import com.google.gson.annotations.Expose;

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
    @Expose
    private Long reviewId;

    @Expose
    @Column()
    private String review_text;

    @Expose
    @Column()
    private Integer review_rating;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "showId")
    private Show show;

    @ManyToMany(mappedBy = "likes")
    private List<User> likedBy = new ArrayList<>();

    public Review() {}

    public Review(User user, Show movie, String review_text, Integer review_rating) {
        this.user = user;
        this.show = movie;
        this.review_text = review_text;
        this.review_rating = review_rating;
    }

    public Long getReview_id() {
        return reviewId;
    }
}
