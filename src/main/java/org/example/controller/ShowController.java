package org.example.controller;

import org.example.model.Celebrity;
import org.example.model.Season;
import org.example.model.Show;
import org.example.model.User;
import org.example.repository.Celebrities;
import org.example.repository.Shows;
import org.example.repository.Users;
import spark.Request;
import spark.Response;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.HashSet;

public class ShowController {
    private final Shows shows;
    private final Celebrities celebrities;
    private final Users users;

    public ShowController(EntityManager entityManager) {
        this.shows = new Shows(entityManager);
        this.users = new Users(entityManager);
        this.celebrities = new Celebrities(entityManager);
    }


    public Object addShow(Request req, Response res) {
        // check admin is signed in
        Long userId = req.session().attribute("user_id");
        User user = users.findUserById(userId);
        if (userId == null) {
            res.status(401); // Unauthorized
            return "You must be signed in to add a show";
        }
        if (!user.isAdmin()) {
            res.status(401); // Unauthorized
            return "You must be an admin to add a show";
        }

        final String title = req.queryParams("title");
        final String description = req.queryParams("description");
        final String show_type = req.queryParams("show_type");

        Celebrity director = celebrities.findCelebrityByName(req.queryParams("director"));
        if (director == null) {
            res.status(401); // Unauthorized
            return "Director not found";
        }

        ArrayList<Celebrity> actors = new ArrayList<>();
        String[] actorNames = req.queryParams("actors").split(",");
        for (String actorName : actorNames) {
            Celebrity actor = celebrities.findCelebrityByName(actorName);
            if (actor == null) {
                res.status(401); // Unauthorized
                return "Actor not found";
            }
            actors.add(actor);
        }

        Show show = new Show(title, description, show_type);

        show.setDirector(director);
        show.setActors(actors);

        if (show_type.equals("tv_show")) {
            final int seasons = Integer.parseInt(req.queryParams("seasons"));

            for (int i = 1; i <= seasons; i++) {
                Season season = new Season(i, show);
                show.addSeason(season);
            }
            shows.persist(show);
            res.type("application/json");
            return show.asJson();
        } else if (show_type.equals("movie")) {
            shows.persist(show);
            res.type("application/json");
            return show.asJson();
        } else {
            res.status(401); // Unauthorized
            return "Invalid show type";
        }
    }

    public Object getShow(Request req, Response res) {
        Long id = Long.parseLong(req.params(":showId"));
        Show show = shows.findShowById(id);

        if (show == null) {
            res.status(404); // Not Found
            return "Show not found";
        }

        res.type("application/json");
        return show.asJson();
    }
}
