package org.example.controller;

import com.google.gson.Gson;
import org.example.dto.AddShowDto;
import org.example.utility.AuthUtility;
import org.example.service.ShowService;
import spark.Request;
import spark.Response;
import javax.persistence.EntityManager;
import java.util.List;


public class ShowController {
    private final Gson gson = new Gson();
    private final ShowService showService;

    public ShowController(EntityManager entityManager) {
        this.showService = new ShowService(entityManager);
    }


    public String addShow(Request req, Response res) {
        String validation = AuthUtility.validateAdmin(req, res);
        if (!validation.equals("admin")) return validation;

        AddShowDto addShowDto = gson.fromJson(req.body(), AddShowDto.class);

        String title = addShowDto.getTitle();
        String description = addShowDto.getDescription();
        String show_type = addShowDto.getShow_type();
        String director = addShowDto.getDirector();
        List<String> actors = addShowDto.getActors();
        Integer seasons = addShowDto.getSeasons();

        res.type("application/json");
        return showService.addShow(title, description, show_type, director, actors, seasons);
    }

    public Object getShow(Request req, Response res) {
        String title = req.params(":title");

        res.type("application/json");
        return showService.getShow(title);
    }
}
