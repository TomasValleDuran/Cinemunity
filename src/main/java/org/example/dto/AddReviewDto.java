package org.example.dto;

import org.example.model.Show;

public class AddReviewDto {
    private final String review;
    private final String rating;

    private final String show_title;

    public AddReviewDto(String show_title, String review, String rating) {
        this.review = review;
        this.rating = rating;
        this.show_title = show_title;
    }

    public String getReview() {
        return review;
    }

    public String getRating() {
        return rating;
    }

    public String getShow() {
        return show_title;
    }
}
