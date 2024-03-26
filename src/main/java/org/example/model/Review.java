package org.example.model;

import javax.persistence.*;
import java.util.HashSet;
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
    @JoinColumn(name = "show_id")
    private Show show;

    @ManyToMany(mappedBy = "likes")
    private Set<User> likedBy = new HashSet<>();

    public Review() {}

    public Review(User user, Show movie, String review_text, Integer review_rating) {
        this.user = user;
        this.show = movie;
        this.review_text = review_text;
        this.review_rating = review_rating;
    }

    public Long getReview_id() {
        return review_id;
    }
}
