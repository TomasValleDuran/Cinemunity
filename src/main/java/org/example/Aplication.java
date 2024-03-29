package org.example;
import com.google.gson.Gson;
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
    private static final Gson gson = new Gson();
    public static void main(String[] args) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory("cinemunityDB");
        final EntityManager entityManager = factory.createEntityManager();

        final UserController userController = new UserController(entityManager);

        Spark.port(3333);

        Spark.post("/user/signup", userController::signup);
        Spark.get("/user/signin", userController::signin);
        Spark.get("/user/signout" , userController::signout);
        Spark.get("/user/:username", userController::getUser);
        Spark.post("/user/follow/:username", userController::followUser);
        Spark.get("/user/:username/followers", userController::getFollowers);
    }

    private static String capitalized(String name) {
        return Strings.isNullOrEmpty(name) ? name : name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
    }
}
