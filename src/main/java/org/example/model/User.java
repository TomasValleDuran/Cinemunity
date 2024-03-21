package org.example.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("ALL")
@Entity
public class User {
    @Id
    @GeneratedValue(generator = "userGen", strategy = GenerationType.SEQUENCE)
    private Long user_id;

    @Column(nullable = false, unique = true)
    private String user_name;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column()
    private Integer user_rating;

    @Column()
    private Integer user_followed;

    @Column()
    private Integer user_followers;

    @Column()
    private Boolean is_admin;

    @Column()
    private Boolean is_verified;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    public User() {}

    public User(String user_name, String password, String email) {
        this.user_name = user_name;
        this.password = password;
        this.email = email;
        this.user_followed = 0;
        this.user_followers = 0;
        this.user_rating = 0;
    }
}
