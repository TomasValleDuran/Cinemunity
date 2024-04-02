package org.example.model;

import com.google.gson.annotations.Expose;

import javax.persistence.*;

@Entity
public class Season {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long seasonId;

    @Column
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

    public Integer getSeasonNumber() {
        return seasonNumber;
    }
}
