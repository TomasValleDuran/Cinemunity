package org.example.model;

import com.google.gson.*;
import com.google.gson.annotations.Expose;

import javax.persistence.*;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("ALL")
@Entity
public class User {
    @Id
    @GeneratedValue(generator = "userGen", strategy = GenerationType.SEQUENCE)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column()
    private Integer user_rating;

    @Column()
    private Boolean is_admin;

    @Column()
    private Boolean is_verified;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "user_follows",
            joinColumns = @JoinColumn(name = "followerId"),
            inverseJoinColumns = @JoinColumn(name = "followeeId")
    )
    private List<User> following = new ArrayList<>();

    @ManyToMany(mappedBy = "following")
    private List<User> followers = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "user_likes",
            joinColumns = @JoinColumn(name = "userId"),
            inverseJoinColumns = @JoinColumn(name = "reviewId")
    )
    private List<Review> likes = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "user_wishlist",
            joinColumns = @JoinColumn(name = "userId"),
            inverseJoinColumns = @JoinColumn(name = "showId")
    )
    private List<Show> wishlist = new ArrayList<>();
    public User() {}

    public User(String email, String user_name, String password) {
        this.username = user_name;
        this.password = password;
        this.email = email;
        this.user_rating = 0;
        this.is_admin = false;
        this.is_verified = false;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public void setAdmin() {
        is_admin = true;
    }

    public boolean isAdmin() {
        return is_admin;
    }

    public void setIs_verified() {
        is_verified = true;
    }

    public String asJson() {
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(User.class, new JsonSerializer<User>() {
                    @Override
                    public JsonElement serialize(User src, Type typeOfSrc, JsonSerializationContext context) {
                        JsonObject jsonObject = new JsonObject();
                        jsonObject.addProperty("userId", src.userId);
                        jsonObject.addProperty("username", src.username);
                        jsonObject.addProperty("email", src.email);
                        jsonObject.addProperty("user_rating", src.user_rating);
                        jsonObject.addProperty("is_admin", src.is_admin);
                        jsonObject.addProperty("is_verified", src.is_verified);

                        JsonArray reviewsArray = new JsonArray();
                        for (Review review : src.reviews) {
                            reviewsArray.add(review.getReviewId());
                        }
                        jsonObject.add("reviews", reviewsArray);

                        JsonArray followingArray = new JsonArray();
                        for (User user : src.following) {
                            followingArray.add(user.getUsername());
                        }
                        jsonObject.add("following", followingArray);

                        JsonArray followersArray = new JsonArray();
                        for (User user : src.followers) {
                            followersArray.add(user.getUsername());
                        }
                        jsonObject.add("followers", followersArray);

                        JsonArray likesArray = new JsonArray();
                        for (Review review : src.likes) {
                            likesArray.add(review.getReviewId());
                        }
                        jsonObject.add("likes", likesArray);

                        JsonArray wishlistArray = new JsonArray();
                        for (Show show : src.wishlist) {
                            wishlistArray.add(show.getTitle());
                        }
                        jsonObject.add("wishlist", wishlistArray);

                        return jsonObject;
                    }
                })
                .create();

        return gson.toJson(this);
    }
}
