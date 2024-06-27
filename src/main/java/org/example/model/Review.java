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

    @Column(length = 2000)
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

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "reviewId")
    private List<Reply> replies = new ArrayList<>();

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

    public User getUser() {
        return user;
    }

    public void likeReview(User user) {
        likedBy.add(user);
    }

    public void unlikeReview(User user) {
        likedBy.remove(user);
    }

    public Integer getNumberOfLikes() {
        return likedBy.size();
    }

    public List<User> getLikedBy() {
        return likedBy;
    }

    public void addReply(Reply reply) {
        replies.add(reply);
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
                        jsonObject.addProperty("userId", src.user.getUserId());
                        jsonObject.addProperty("title", src.show.getTitle());
                        jsonObject.addProperty("showId", src.show.getShowId());
                        jsonObject.addProperty("show_img", src.show.getImage());
                        jsonObject.addProperty("likes", src.likedBy.size());

                        JsonArray repliesArray = new JsonArray();
                        for (Reply reply : src.replies) {
                            repliesArray.add(reply.getReplyId());
                        }
                        jsonObject.add("replies", repliesArray);
                        return jsonObject;
                    }
                })
                .create();

        return gson.toJson(this);
    }
}
