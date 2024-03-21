package org.example.model;

import javax.persistence.*;

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

    public Review() {}

    public Review(User user, String review_text, Integer review_rating) {
        this.user = user;
        this.review_text = review_text;
        this.review_rating = review_rating;
    }
}
