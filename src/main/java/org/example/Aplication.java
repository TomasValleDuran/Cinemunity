package org.example;

import org.example.controller.CelebrityController;
import org.example.controller.ShowController;
import org.example.controller.UserController;
import org.example.controller.ReviewController;
import spark.*;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import static org.example.utility.EntityManagerUtil.setFactory;
import static org.example.utility.EntityManagerUtil.closeCurrentEntityManager;
import static spark.Spark.*;

public class Aplication {
    public static void main(String[] args) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory("cinemunityDB");
        setFactory(factory);

        final UserController userController = new UserController();
        final ShowController showController = new ShowController();
        final CelebrityController celebrityController = new CelebrityController();
        final ReviewController reviewController = new ReviewController();

        Spark.port(3333);

        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));

        Spark.get("/api/user/currentUser", userController::getCurrentUser);
        Spark.post("/api/user/signup", userController::signup);
        Spark.post("/api/user/signin", userController::signin);
        Spark.get("/api/user/get/:username", userController::getUser);
        Spark.get("/api/user/getLikedReviews/:username", userController::getLikedReviews);

        Spark.post("/api/show/addShow", showController::addShow);
        Spark.get("/api/show/get/:title", showController::getShow);
        Spark.get("/api/show/getAll", showController::getAllShows);

        Spark.post("/api/celebrity/addCelebrity", celebrityController::addCelebrity);
        Spark.get("/api/celebrity/get/:celebrityName", celebrityController::getCelebrity);

        Spark.post("/api/review/addReview", reviewController::addReview);
        Spark.post("/api/review/getReviewsByIds", reviewController::getReviewsByIds);
        Spark.put("/api/review/likeReview/:reviewId", reviewController::likeReview);
        Spark.put("/api/review/unlikeReview/:reviewId", reviewController::unlikeReview);


        after((request, response) -> closeCurrentEntityManager());
    }
}