package org.example.controller;

import org.example.model.Season;
import org.example.model.Show;
import org.example.repository.Shows;
import spark.Request;
import spark.Response;

import javax.persistence.EntityManager;

public class ShowController {
    private final Shows shows;

    public ShowController(EntityManager entityManager) {
        this.shows = new Shows(entityManager);
    }


    public Object addShow(Request req, Response res) {
        // check admin is signed in
        Long userId = req.session().attribute("user_id");
        if (userId == null) {
            res.status(401); // Unauthorized
            return "You must be signed in to add a show";
        }
        if (userId != 1) {
            res.status(401); // Unauthorized
            return "You must be an admin to add a show";
        }

        final String title = req.queryParams("title");
        final String description = req.queryParams("description");
        final String show_type = req.queryParams("show_type");

        Show show = new Show(title, description, show_type);

        if (show_type.equals("tv_show")) {
            final int seasons = Integer.parseInt(req.queryParams("seasons"));

            for (int i = 1; i <= seasons; i++) {
                Season season = new Season(i, show);
                show.addSeason(season);
            }
            shows.persist(show);
            return show.asJson();
        } else if (show_type.equals("movie")) {
            shows.persist(show);
            return show.asJson();
        } else {
            res.status(401); // Unauthorized
            return "Invalid show type";
        }
    }
}
