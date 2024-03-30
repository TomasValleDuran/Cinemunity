package org.example.controller;

import org.example.model.Celebrity;
import org.example.repository.Celebrities;
import spark.Request;
import spark.Response;

import javax.persistence.EntityManager;

public class CelebrityController {
    private final Celebrities celebrities;

    public CelebrityController(EntityManager entityManager) {
        this.celebrities = new Celebrities(entityManager);
    }

    public Object addCelebrity(Request req, Response res) {
        // check admin is signed in
        Long userId = req.session().attribute("user_id");
        if (userId == null) {
            res.status(401); // Unauthorized
            return "You must be signed in to add a celebrity";
        }
        if (userId != 1) {
            res.status(401); // Unauthorized
            return "You must be an admin to add a celebrity";
        }

        final String name = req.queryParams("name");
        final String bio = req.queryParams("bio");

        Celebrity celebrity = new Celebrity(name, bio);
        celebrities.persist(celebrity);
        return celebrity.asJson();
    }
}
