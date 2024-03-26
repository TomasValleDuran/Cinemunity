package org.example.model;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Celebrity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column()
    private String bio;

    @ManyToMany(mappedBy = "actors")
    private Set<Show> actedShows = new HashSet<>();

    @OneToMany(mappedBy = "director")
    private Set<Show> directedShows = new HashSet<>();

    public Celebrity() {}

    public Celebrity(String name, String bio) {
        this.name = name;
        this.bio = bio;
    }
}