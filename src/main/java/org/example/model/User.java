package org.example.model;

import com.google.gson.Gson;
import com.google.gson.annotations.Expose;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("ALL")
@Entity
public class User {
    @Id
    @GeneratedValue(generator = "userGen", strategy = GenerationType.SEQUENCE)
    @Expose
    private Long userId;

    @Expose
    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Expose
    @Column(nullable = false, unique = true)
    private String email;

    @Expose
    @Column()
    private Integer user_rating;

    @Expose
    @Column()
    private Boolean is_admin;

    @Expose
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
    private List<User> likes = new ArrayList<>();

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
        Gson gson = new Gson();
        return gson.toJson(this);
    }
}
