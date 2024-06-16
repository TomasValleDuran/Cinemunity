package org.example.tmdb;

import spark.Request;
import spark.Response;

public class TMDbController {
    private final TMDbService tmDbService = new TMDbService();

    public TMDbController() {
    }

    public String searchActor(Request req, Response res) {
        String actorName = req.params(":name");
        try {
            res.type("application/json");
            return tmDbService.searchActor(actorName);
        } catch (Exception e) {
            res.status(500);
            return "Error: " + e.getMessage();
        }
    }

    public String getActorDetails(Request req, Response res) {
        int actorId = Integer.parseInt(req.params(":celebrityId"));
        try {
            res.type("application/json");
            return tmDbService.getActorDetails(actorId);
        } catch (Exception e) {
            res.status(500);
            return "Error: " + e.getMessage();
        }
    }
}
