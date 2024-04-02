package org.example.controller;

import com.google.gson.Gson;
import org.example.dto.AddCelebrityDto;
import org.example.model.Celebrity;
import org.example.model.User;
import org.example.repository.Celebrities;
import org.example.repository.Users;
import org.example.service.CelerbrityService;
import spark.Request;
import spark.Response;

import javax.persistence.EntityManager;

public class CelebrityController {
    private final Celebrities celebrities;
    private final CelerbrityService celebrityService;
    private Users users;
    private final Gson gson = new Gson();

    public CelebrityController(EntityManager entityManager) {
        this.celebrities = new Celebrities(entityManager);
        this.users = new Users(entityManager);
        this.celebrityService = new CelerbrityService(entityManager);
    }

    public Object addCelebrity(Request req, Response res) {
        String validation = validateUser(req, res);
        if (validation != null) return validation;

        AddCelebrityDto addCelebrityDto = gson.fromJson(req.body(), AddCelebrityDto.class);
        String name = addCelebrityDto.getName();
        String biography = addCelebrityDto.getBiography();

        res.type("application/json");
        return celebrityService.addCelebrity(name, biography);
    }

    private String validateUser(Request req, Response res) {
        Long userId = req.session().attribute("userId");
        User user = users.findUserById(userId);
        if (userId == null) {
            res.status(401); // Unauthorized
            return "You must be signed in to add a show";
        }
        if (!user.isAdmin()) {
            res.status(401); // Unauthorized
            return "You must be an admin to add a show";
        }
        return null;
    }

    public Object getCelebrity(Request req, Response res) {
        String name = req.params(":celebrityName");

        res.type("application/json");
        return celebrityService.getCelebrity(name);
    }
}
