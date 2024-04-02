package org.example.model;

import com.google.gson.Gson;
import com.google.gson.annotations.Expose;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Celebrity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Expose
    private Long celebrityId;

    @Expose
    @Column(nullable = false, unique = true)
    private String name;

    @Expose
    @Column()
    private String bio;

    @ManyToMany(mappedBy = "actors")
    private List<Show> actedShows = new ArrayList<>();

    @OneToMany(mappedBy = "director")
    private List<Show> directedShows = new ArrayList<>();

    public Celebrity() {}

    public Celebrity(String name, String bio) {
        this.name = name;
        this.bio = bio;
    }

    public String asJson() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }

    public String getName() {
        return name;
    }
}