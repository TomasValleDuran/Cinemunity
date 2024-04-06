package org.example;

import com.google.gson.Gson;
import org.example.controller.CelebrityController;
import org.example.controller.ShowController;
import org.example.controller.UserController;
import spark.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;


import static spark.Spark.*;

public class Aplication {
    static Gson gson = new Gson();
    public static void main(String[] args) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory("cinemunityDB");
        final EntityManager entityManager = factory.createEntityManager();

        final UserController userController = new UserController(entityManager);
        final ShowController showController = new ShowController(entityManager);
        final CelebrityController celebrityController = new CelebrityController(entityManager);

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

        Spark.get("/user/currentUser", userController::getCurrentUser);
        Spark.post("/user/signup", userController::signup);
        Spark.post("/user/signin", userController::signin);
        Spark.get("/user/signout" , userController::signout);
        Spark.get("/user/:username", userController::getUser);

        Spark.post("/show/addShow", showController::addShow);
        Spark.get("/show/:title", showController::getShow);

        Spark.post("/celebrity/addCelebrity", celebrityController::addCelebrity);
        Spark.get("/celebrity/:celebrityName", celebrityController::getCelebrity);
    }
}
