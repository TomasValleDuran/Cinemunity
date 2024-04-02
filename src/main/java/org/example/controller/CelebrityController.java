package org.example.controller;

import org.example.model.Celebrity;
import org.example.model.User;
import org.example.repository.Celebrities;
import org.example.repository.Users;
import spark.Request;
import spark.Response;

import javax.persistence.EntityManager;

public class CelebrityController {
    private final Celebrities celebrities;
    private Users users;

    public CelebrityController(EntityManager entityManager) {
        this.celebrities = new Celebrities(entityManager);
        this.users = new Users(entityManager);
    }

    public Object addCelebrity(Request req, Response res) {
        // check admin is signed in
        Long userId = req.session().attribute("user_id");
        User user = users.findUserById(userId);
        if (userId == null) {
            res.status(401); // Unauthorized
            return "You must be signed in to add a show";
        }
        if (!user.isAdmin()) {
            res.status(401); // Unauthorized
            return "You must be an admin to add a show";
        }

        final String name = req.queryParams("name");
        final String bio = req.queryParams("bio");

        Celebrity celebrity = new Celebrity(name, bio);
        celebrities.persist(celebrity);
        return celebrity.asJson();
    }

    public Object getCelebrity(Request req, Response res) {
        String name = req.params(":celebrityName");
        Celebrity celebrity = celebrities.findCelebrityByName(name);
        if (celebrity == null) {
            res.status(404); // Not Found
            return "Celebrity not found";
        }

        res.type("application/json");
        return celebrity.asJson();
    }
}
