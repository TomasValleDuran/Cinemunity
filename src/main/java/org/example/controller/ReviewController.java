package org.example.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import org.example.dto.AddReviewDto;
import org.example.model.Show;
import org.example.model.User;
import org.example.repository.Shows;
import org.example.repository.Users;
import org.example.service.ReviewService;
import org.example.utility.AuthUtility;
import spark.Request;
import spark.Response;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class ReviewController {

    private final Gson gson = new Gson();
    private final ReviewService reviewService;

    private final Users users;
    private final Shows shows;

    public ReviewController() {
        this.reviewService = new ReviewService();
        this.users = new Users();
        this.shows = new Shows();
    }

    public String addReview(Request req, Response res) {
        Long id = AuthUtility.getUserIdFromToken(req.headers("Authorization"));
        if (id == null) {
            res.status(401);
            return "Invalid or expired token";
        }

        User user = users.findUserById(AuthUtility.getUserIdFromToken(req.headers("Authorization")));

        AddReviewDto addReviewDto = gson.fromJson(req.body(), AddReviewDto.class);

        Show show = shows.findShowByTitle(addReviewDto.getShow());
        res.type("application/json");
        return reviewService.addReview(user, show, addReviewDto.getReview(), addReviewDto.getRating());
    }

    public Object getReviewsByIds(Request req, Response res) throws JsonProcessingException {
        Type listType = new TypeToken<ArrayList<Long>>(){}.getType();
        List<Long> reviewIds = new Gson().fromJson(req.body(), listType);
        res.type("application/json");
        return reviewService.getReviewsByIds(reviewIds);
    }

    public String likeReview(Request req, Response res) {
        Long id = AuthUtility.getUserIdFromToken(req.headers("Authorization"));
        if (id == null) {
            res.status(401);
            return "Invalid or expired token";
        }
        User user = users.findUserById(id);
        return reviewService.likeReview(user, Long.parseLong(req.params(":reviewId")));
    }

    public String unlikeReview(Request req, Response res) {
        Long id = AuthUtility.getUserIdFromToken(req.headers("Authorization"));
        if (id == null) {
            res.status(401);
            return "Invalid or expired token";
        }
        User user = users.findUserById(id);
        return reviewService.unlikeReview(user, Long.parseLong(req.params(":reviewId")));
    }

}
