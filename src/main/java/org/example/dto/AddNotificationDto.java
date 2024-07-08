package org.example.dto;

public class AddNotificationDto {
    private String message;
    private String username;
    private String taggerId;
    private String showId;
    private String reviewId;

    public AddNotificationDto() {}

    public AddNotificationDto(String message, String username, String  taggerId, String showId, String reviewId) {
        this.message = message;
        this.username = username;
        this.taggerId = taggerId;
        this.showId = showId;
        this.reviewId = reviewId;
    }

    public String getMessage() {
        return message;
    }

    public String getUsername() {
        return username;
    }

    public Long getTaggerId() {
        return Long.parseLong(taggerId);
    }

    public Long getShowId() {
        return Long.parseLong(showId);
    }

    public Long getReviewId() {
        return Long.parseLong(reviewId);
    }
}
