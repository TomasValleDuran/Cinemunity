package org.example.dto;

public class AddReplyDto {
    final String reply;
    final Long review_id;

    public AddReplyDto(String reply, Long reviewId) {
        this.reply = reply;
        this.review_id = reviewId;
    }

    public String getReply() {
        return reply;
    }

    public Long getReviewId() {
        return review_id;
    }

}
