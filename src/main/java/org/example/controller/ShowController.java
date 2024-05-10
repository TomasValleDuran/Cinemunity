package org.example.controller;

import com.google.gson.Gson;
import org.example.dto.AddShowDto;
import org.example.dto.FullObjectKeyDto;
import org.example.utility.AuthUtility;
import org.example.service.ShowService;
import spark.Request;
import spark.Response;

import java.util.List;


public class ShowController {
    private final Gson gson = new Gson();
    private final ShowService showService;

    public ShowController() {
        this.showService = new ShowService();
    }


    public String addShow(Request req, Response res) {
        // Validate if the user is an admin
        String validation = AuthUtility.validateAdmin(req, res);
        if (!validation.equals("Admin")) return validation;

        AddShowDto addShowDto = gson.fromJson(req.body(), AddShowDto.class);

        String title = addShowDto.getTitle();
        String description = addShowDto.getDescription();
        String show_type = addShowDto.getShow_type();
        String director = addShowDto.getDirector();
        List<String> actors = addShowDto.getActors();
        Integer seasons = addShowDto.getSeasons();
        String objectKey = addShowDto.getObjectKey();

        res.type("application/json");
        try {
            return showService.addShow(title, description, show_type, director, actors, seasons, objectKey);
        } catch (Exception e) {
            res.status(400);
            return e.getMessage();
        }
    }

    public String getShow(Request req, Response res) {
        Long showId = Long.valueOf(req.params(":showId"));

        res.type("application/json");
        return showService.getShow(showId);
    }

    public List<String> getSearchedShowsList(Request req, Response res){
        String search = req.params(":search");
        String type = req.url().split("/")[4];
        res.type("application/json");
        return showService.getSearchedShows(search, type);
    }

    public List<String> getAllShows(Request req, Response res) {
        res.type("application/json");
        return showService.getAllShows();
    }

    public String updateImage(Request req, Response res) {
        String admin = AuthUtility.validateAdmin(req, res);
        if (!admin.equals("Admin")) return admin;

        FullObjectKeyDto fullObjectKeyDto = gson.fromJson(req.body(), FullObjectKeyDto.class);
        String objectKey = fullObjectKeyDto.getFullObjectKey();
        Long id = fullObjectKeyDto.getId();
        res.type("application/json");
        return showService.updateImage(objectKey, id);
    }
}
