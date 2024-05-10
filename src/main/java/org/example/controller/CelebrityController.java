package org.example.controller;

import com.google.gson.Gson;
import org.example.dto.AddCelebrityDto;
import org.example.dto.FullObjectKeyDto;
import org.example.service.CelerbrityService;
import org.example.utility.AuthUtility;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;
import spark.Request;
import spark.Response;

import java.util.List;

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
        String objectKey = addCelebrityDto.getObjectKey();

        res.type("application/json");
        try {
            return celebrityService.addCelebrity(name, biography, objectKey);
        } catch (IllegalArgumentException e) {
            res.status(400);
            return e.getMessage();
        }
    }

    public Object getCelebrity(Request req, Response res) {
        Long celebrityId = Long.valueOf(req.params(":celebrityId"));

        res.type("application/json");
        return celebrityService.getCelebrity(celebrityId);
    }

    public List<String> getSearchedCelebrityList(Request req, Response res) {
        String search = req.params(":search");

        res.type("application/json");
        return celebrityService.getSearchedCelebrityList(search);
    }

    public String updateImage(Request req, Response res) {
        String admin = AuthUtility.validateAdmin(req, res);
        if (!admin.equals("Admin")) return admin;

        FullObjectKeyDto fullObjectKeyDto = gson.fromJson(req.body(), FullObjectKeyDto.class);
        String objectKey = fullObjectKeyDto.getFullObjectKey();
        Long id = fullObjectKeyDto.getId();
        res.type("application/json");
        return celebrityService.updateImage(objectKey, id);
    }
}
