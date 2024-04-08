package org.example.controller;

import com.google.gson.Gson;
import org.example.dto.AddCelebrityDto;
import org.example.service.CelerbrityService;
import org.example.utility.AuthUtility;
import spark.Request;
import spark.Response;

import javax.persistence.EntityManager;

public class CelebrityController {
    private final CelerbrityService celebrityService;
    private final Gson gson = new Gson();

    public CelebrityController(EntityManager entityManager) {
        this.celebrityService = new CelerbrityService(entityManager);
    }

    public Object addCelebrity(Request req, Response res) {
        String validation = AuthUtility.validateAdmin(req, res);
        if (!validation.equals("admin")) return validation;

        AddCelebrityDto addCelebrityDto = gson.fromJson(req.body(), AddCelebrityDto.class);
        String name = addCelebrityDto.getName();
        String biography = addCelebrityDto.getBiography();

        res.type("application/json");
        return celebrityService.addCelebrity(name, biography);
    }

    public Object getCelebrity(Request req, Response res) {
        String name = req.params(":celebrityName");

        res.type("application/json");
        return celebrityService.getCelebrity(name);
    }
}
