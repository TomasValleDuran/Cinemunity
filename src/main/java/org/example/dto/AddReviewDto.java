package org.example.dto;

import org.example.model.Show;

public class AddReviewDto {
    private final String review;
    private final String rating;

    private final Show show;

    public AddReviewDto(Show show, String review, String rating) {
        this.review = review;
        this.rating = rating;
        this.show = show;
    }

    public String getReview() {
        return review;
    }

    public String getRating() {
        return rating;
    }

    public Show getShow() {
        return show;
    }
}
