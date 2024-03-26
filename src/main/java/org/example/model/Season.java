package org.example.model;

import javax.persistence.*;

@Entity
public class Season {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column
    private Integer seasonNumber;

    @Column
    private Integer numberOfEpisodes;

    @ManyToOne
    @JoinColumn(name = "show_id")
    private Show show;

    public Season() {}

    public Season(Integer seasonNumber, Integer numberOfEpisodes, Show show) {
        this.seasonNumber = seasonNumber;
        this.numberOfEpisodes = numberOfEpisodes;
        this.show = show;
    }

    public void setShow(Show show) {
        this.show = show;
    }
}
