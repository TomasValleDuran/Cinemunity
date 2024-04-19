package org.example.model;

import com.google.gson.*;

import javax.persistence.*;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("ALL")
@Entity
public class Review {
    @Id
    @GeneratedValue(generator = "userGen", strategy = GenerationType.SEQUENCE)
    private Long reviewId;

    @Column()
    private String review_text;

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

    public Long getReviewId() {
        return reviewId;
    }

    public String getUserName() {
        return user.getUsername();
    }

    public void likeReview(User user) {
        likedBy.add(user);
    }

    public void unlikeReview(User user) {
        likedBy.remove(user);
    }

    public String asJson() {
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Review.class, new JsonSerializer<Review>() {
                    @Override
                    public JsonElement serialize(Review src, Type typeOfSrc, JsonSerializationContext context) {
                        JsonObject jsonObject = new JsonObject();
                        jsonObject.addProperty("reviewId", src.reviewId);
                        jsonObject.addProperty("review_text", src.review_text);
                        jsonObject.addProperty("review_rating", src.review_rating);
                        jsonObject.addProperty("username", src.user.getUsername());
                        jsonObject.addProperty("showTitle", src.show.getTitle());
                        jsonObject.addProperty("likes", src.likedBy.size());
                        return jsonObject;
                    }
                })
                .create();

        return gson.toJson(this);
    }
}
