package org.example.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import org.example.dto.AddReplyDto;
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
        try {
            return reviewService.addReview(user, show, addReviewDto.getReview(), Integer.parseInt(addReviewDto.getRating()));
        } catch (Exception e) {
            res.status(400);
            return e.getMessage();
        }
    }

    public Object getReviewsByIds(Request req, Response res) {
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

    public Object deleteReview(Request req, Response res) {
        Long id = AuthUtility.getUserIdFromToken(req.headers("Authorization"));
        if (id == null) {
            res.status(401);
            return "Invalid or expired token";
        }
        User user = users.findUserById(id);
        try {
            reviewService.deleteReview(user, Long.parseLong(req.params(":reviewId")));
            return "Review deleted";
        } catch (Exception e) {
            res.status(400);
            return e.getMessage();
        }
    }

    public String addReply(Request req, Response res) {
        Long id = AuthUtility.getUserIdFromToken(req.headers("Authorization"));
        if (id == null) {
            res.status(401);
            return "Invalid or expired token";
        }
        User user = users.findUserById(AuthUtility.getUserIdFromToken(req.headers("Authorization")));

        AddReplyDto addReplyDto = gson.fromJson(req.body(), AddReplyDto.class);
        res.type("application/json");
        try {
            return reviewService.addReply(user, addReplyDto.getReviewId(), addReplyDto.getReply());
        } catch (Exception e) {
            res.status(400);
            return e.getMessage();
        }
    }

    public Object getReplies(Request req, Response res) {
        Type listType = new TypeToken<ArrayList<Long>>(){}.getType();
        List<Long> replyIds = new Gson().fromJson(req.body(), listType);
        System.out.println(replyIds);
        res.type("application/json");
        return reviewService.getRepliesByIds(replyIds);
    }

    public String deleteReply(Request req, Response res) {
        Long id = AuthUtility.getUserIdFromToken(req.headers("Authorization"));
        if (id == null) {
            res.status(401);
            return "Invalid or expired token";
        }
        User user = users.findUserById(id);

        try {
            String replyId = req.params(":replyId");
            replyId = replyId.substring(1);
            reviewService.deleteReply(user, replyId);
            return "Reply deleted";
        } catch (NumberFormatException e) {
            res.status(400);
            return "Invalid reply ID format";
        } catch (Exception e) {
            res.status(400);
            return e.getMessage();
        }
    }

    public String getReview(Request req, Response res) {
        Long id = AuthUtility.getUserIdFromToken(req.headers("Authorization"));
        if (id == null) {
            res.status(401);
            return "Invalid or expired token";
        }
        res.type("application/json");
        return reviewService.getReview(Long.parseLong(req.params(":reviewId")));
    }
}
