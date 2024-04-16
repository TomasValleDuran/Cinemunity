package org.example.service;

import org.example.model.Review;
import org.example.model.Show;
import org.example.model.User;
import org.example.repository.Reviews;


import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

public class ReviewService {
    Reviews reviews;
    public ReviewService() {
        this.reviews = new Reviews();
    }

    public String addReview(User user, Show movie, String review_text, String rating) {
        if (review_text == null || review_text.isEmpty()) {
            return "Review is required";
        }

        if (rating == null || rating.isEmpty()) {
            return "Rating is required";
        }

        Review review = new Review(user, movie, review_text, Integer.parseInt(rating));

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
}
