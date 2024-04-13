package org.example.controller;

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

import javax.persistence.EntityManager;

public class ReviewController {

    private final Gson gson = new Gson();
    private final ReviewService reviewService;

    private final Users users;
    private final Shows shows;

    public ReviewController(EntityManager entityManager) {
        this.reviewService = new ReviewService(entityManager);
        this.users = new Users(entityManager);
        this.shows = new Shows(entityManager);
    }

    public String addReview(Request req, Response res) {
        String validation = AuthUtility.validateAdmin(req, res);
        if (!validation.equals("admin")) return validation;

        User user = users.findUserById(AuthUtility.getUserIdFromToken(req.headers("Authorization")));

        AddReviewDto addReviewDto = gson.fromJson(req.body(), AddReviewDto.class);

        Show show = shows.findShowByTitle(addReviewDto.getShow());
        res.type("application/json");
        return reviewService.addReview(user, show, addReviewDto.getReview(), addReviewDto.getRating());
    }
}