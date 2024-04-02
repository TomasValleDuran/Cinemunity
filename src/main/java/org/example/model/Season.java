package org.example.model;

import com.google.gson.annotations.Expose;

import javax.persistence.*;

@Entity
public class Season {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Expose
    private Long seasonId;

    @Column
    @Expose
    private Integer seasonNumber;

    @ManyToOne
    @JoinColumn(name = "showId")
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
