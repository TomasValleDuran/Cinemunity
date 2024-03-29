package org.example.model;

import com.google.gson.Gson;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@SuppressWarnings("ALL")
@Entity
public class User {
    @Id
    @GeneratedValue(generator = "userGen", strategy = GenerationType.SEQUENCE)
    private Long user_id;

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
            joinColumns = @JoinColumn(name = "follower_id"),
            inverseJoinColumns = @JoinColumn(name = "followee_id")
    )
    private Set<User> following = new HashSet<>();

    @ManyToMany(mappedBy = "following")
    private Set<User> followers = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "user_likes",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "review_id")
    )
    private Set<Review> likes = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "user_wishlist",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "movie_id")
    )
    private Set<Show> wishlist = new HashSet<>();
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
        return user_id;
    }

    public String getUsername() {
        return username;
    }

    public void follow(User user) {
        following.add(user);
    }

    public void unfollow(User user) {
        following.remove(user);
    }

    public void like(Review review) {
        likes.add(review);
    }

    public void unlike(Review review) {
        likes.remove(review);
    }

    public void addToWishlist(Show movie) {
        wishlist.add(movie);
        movie.getWishlistedBy().add(this);
    }

    public void removeFromWishlist(Show movie) {
        wishlist.remove(movie);
        movie.getWishlistedBy().remove(this);
    }

    public void setAdmin() {
        is_admin = true;
    }

    public void setIs_verified() {
        is_verified = true;
    }

    public Set<User> getFollowers() {
        return followers;
    }

    public String asJson() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }
}
