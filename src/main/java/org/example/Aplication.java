package org.example;

import org.example.controller.CelebrityController;
import org.example.controller.ShowController;
import org.example.controller.UserController;
import org.example.controller.ReviewController;
import spark.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;


import static spark.Spark.*;

public class Aplication {
    public static void main(String[] args) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory("cinemunityDB");
        final EntityManager entityManager = factory.createEntityManager();

        final UserController userController = new UserController(entityManager);
        final ShowController showController = new ShowController(entityManager);
        final CelebrityController celebrityController = new CelebrityController(entityManager);
        final ReviewController reviewController = new ReviewController(entityManager);

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

        Spark.post("/api/show/addShow", showController::addShow);
        Spark.get("/api/show/get/:title", showController::getShow);
        Spark.get("/api/show/getAll", showController::getAllShows);

        Spark.post("/api/celebrity/addCelebrity", celebrityController::addCelebrity);
        Spark.get("/api/celebrity/get/:celebrityName", celebrityController::getCelebrity);

        Spark.post("/api/review/addReview", reviewController::addReview);
        Spark.get("/api/review/getReviews/:id", reviewController::getReviews);
    }
}
