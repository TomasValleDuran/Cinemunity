package org.example.model;

import javax.persistence.*;

@Entity
public class Season {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column
    private Integer seasonNumber;

    @ManyToOne
    @JoinColumn(name = "show_id")
    private Show show;

    public Season() {}

    public Season(Integer seasonNumber, Show show) {
        this.seasonNumber = seasonNumber;
        this.show = show;
    }

    public void setShow(Show show) {
        this.show = show;
    }

    public void setSeasonNumber(Integer seasonNumber) {
        this.seasonNumber = seasonNumber;
    }
}
