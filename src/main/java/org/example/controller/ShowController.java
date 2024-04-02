package org.example.controller;

import com.google.gson.Gson;
import org.example.dto.AddShowDto;
import org.example.model.User;
import org.example.repository.Users;
import org.example.service.ShowService;
import spark.Request;
import spark.Response;
import javax.persistence.EntityManager;


public class ShowController {
    private final Users users;
    private final Gson gson = new Gson();
    private final ShowService showService;

    public ShowController(EntityManager entityManager) {
        this.showService = new ShowService(entityManager);
        this.users = new Users(entityManager);
    }


    public String addShow(Request req, Response res) {
        String validation = validateUser(req, res);
        if (validation != null) return validation;

        AddShowDto addShowDto = gson.fromJson(req.body(), AddShowDto.class);
        String title = addShowDto.getTitle();
        String description = addShowDto.getDescription();
        String show_type = addShowDto.getShow_type();
        String director = addShowDto.getDirector();
        String[] actors = addShowDto.getActors();
        Integer seasons = addShowDto.getSeasons();

        res.type("application/json");
        return showService.addShow(title, description, show_type, director, actors, seasons);
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

    public Object getShow(Request req, Response res) {
        String title = req.params(":title");

        res.type("application/json");
        return showService.getShow(title);
    }
}
