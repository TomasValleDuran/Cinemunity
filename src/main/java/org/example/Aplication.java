package org.example;
import com.google.gson.Gson;
import org.example.controller.CelebrityController;
import org.example.controller.ShowController;
import org.example.controller.UserController;
import org.example.model.User;
import org.example.repository.Users;
import spark.Spark;
import com.google.common.base.Strings;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

import java.time.Instant;

import static spark.Spark.*;

public class Aplication {
    public static void main(String[] args) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory("cinemunityDB");
        final EntityManager entityManager = factory.createEntityManager();

        final UserController userController = new UserController(entityManager);
        final ShowController showController = new ShowController(entityManager);
        final CelebrityController celebrityController = new CelebrityController(entityManager);

        Spark.port(3333);

        Spark.post("/user/signup", userController::signup);
        Spark.get("/user/signin", userController::signin);
        Spark.get("/user/signout" , userController::signout);
        Spark.get("/user/:username", userController::getUser);

        Spark.post("/show/addShow", showController::addShow);
        Spark.get("/show/:title", showController::getShow);

        Spark.post("/celebrity/addCelebrity", celebrityController::addCelebrity);
        Spark.get("/celebrity/:celebrityName", celebrityController::getCelebrity);
    }
}
