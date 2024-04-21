package org.example.controller;

import com.google.gson.Gson;
import org.example.dto.AddCelebrityDto;
import org.example.service.CelerbrityService;
import org.example.utility.AuthUtility;
import spark.Request;
import spark.Response;

public class CelebrityController {
    private final CelerbrityService celebrityService;
    private final Gson gson = new Gson();

    public CelebrityController() {
        this.celebrityService = new CelerbrityService();
    }

    public Object addCelebrity(Request req, Response res) {
        // Validate if the user is an admin
        String validation = AuthUtility.validateAdmin(req, res);
        if (!validation.equals("Admin")) return validation;

        AddCelebrityDto addCelebrityDto = gson.fromJson(req.body(), AddCelebrityDto.class);
        String name = addCelebrityDto.getName();
        String biography = addCelebrityDto.getBiography();

        res.type("application/json");
        try {
            return celebrityService.addCelebrity(name, biography);
        } catch (IllegalArgumentException e) {
            res.status(400);
            return e.getMessage();
        }
    }

    public Object getCelebrity(Request req, Response res) {
        String name = req.params(":celebrityName");

        res.type("application/json");
        return celebrityService.getCelebrity(name);
    }
}
