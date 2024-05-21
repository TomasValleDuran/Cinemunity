package org.example.service;

import org.example.model.Review;
import org.example.model.Show;
import org.example.model.User;
import org.example.repository.Reviews;
import org.example.repository.Users;


import java.util.ArrayList;
import java.util.List;

public class ReviewService {
    Reviews reviews;
    Users users;
    public ReviewService() {
        this.reviews = new Reviews();
        this.users = new Users();
    }

    public String addReview(User user, Show movie, String review_text, int rating) {
        if (review_text == null || review_text.isEmpty()) {
            throw new IllegalArgumentException("Review is empty!");
        }

        if (rating == 0) {
            throw new IllegalArgumentException("Rating is required");
        }

        Review review = new Review(user, movie, review_text, rating);

        reviews.saveReview(review);
        return review.asJson();
    }


    public List<String> getReviewsByIds(List<Long> ids) {
        List<Review> reviewList = reviews.findReviewsByIds(ids);
        List<String> jsonList = new ArrayList<>();
        for (Review review : reviewList) {
            jsonList.add(review.asJson());
        }
        return jsonList;
    }

    public String likeReview(User user, Long reviewId) {
        Review review = reviews.getReviewById(reviewId);

        if (user.getLikes().contains(review)) {
            throw new RuntimeException("You have already liked this review");
        }

        user.likeReview(review);
        review.likeReview(user);

        reviews.updateReview(review);
        users.update(user);
        return review.asJson();

    }

    public String unlikeReview(User user, Long reviewId) {
        Review review = reviews.getReviewById(reviewId);
        if (!user.getLikes().contains(review)) {
            throw new RuntimeException("You haven't liked this review");
        }

        user.unlikeReview(review);
        review.unlikeReview(user);

        reviews.updateReview(review);
        users.update(user);
        return review.asJson();
    }

    public void deleteReview(User user, Long reviewId) {
        Review review = reviews.getReviewById(reviewId);
        if (!user.getReviews().contains(review) && !user.isAdmin()) {
            throw new RuntimeException("You can't delete this review");
        }
        reviews.deleteReview(reviewId);
    }
}
