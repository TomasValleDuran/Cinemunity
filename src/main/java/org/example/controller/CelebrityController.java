package org.example.controller;

import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import org.example.dto.AddCelebrityDto;
import org.example.dto.FullObjectKeyDto;
import org.example.dto.ModifyCelebrityDto;
import org.example.service.CelerbrityService;
import org.example.utility.AuthUtility;
import spark.Request;
import spark.Response;

import java.lang.reflect.Type;
import java.util.ArrayList;
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

    public List<String> getDirectedShows(Request req, Response res) {
        Long celebrityId = Long.valueOf(req.params(":celebrityId"));

        res.type("application/json");
        return celebrityService.getDirectedShows(celebrityId);
    }

    public List<String> getActedShows(Request req, Response res) {
        Long celebrityId = Long.valueOf(req.params(":celebrityId"));

        res.type("application/json");
        return celebrityService.getActedShows(celebrityId);
    }

    public List<String> getCelebritiesByIds(Request req, Response res) {
        Type listType = new TypeToken<ArrayList<Long>>(){}.getType();
        List<Long> celebrityIds = new Gson().fromJson(req.body(), listType);
        res.type("application/json");
        return celebrityService.getCelebritiesByIds(celebrityIds);
    }

    public String modifyCelebrity(Request req, Response res) {
        String admin = AuthUtility.validateAdmin(req, res);
        if (!admin.equals("Admin")) return admin;

        ModifyCelebrityDto modifyCelebrityDto = gson.fromJson(req.body(), ModifyCelebrityDto.class);
        Long id = modifyCelebrityDto.getId();
        String name = modifyCelebrityDto.getName();
        String biography = modifyCelebrityDto.getBiography();

        try {
            return celebrityService.modifyCelebrity(id, name, biography);
        } catch (IllegalArgumentException e) {
            res.status(400);
            return e.getMessage();
        }
    }
}
