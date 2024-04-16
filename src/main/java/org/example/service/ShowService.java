package org.example.service;

import org.example.model.Celebrity;
import org.example.model.Season;
import org.example.model.Show;
import org.example.repository.Celebrities;
import org.example.repository.Shows;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

public class ShowService {

    private final Shows shows;
    private final Celebrities celebrities;

    public ShowService(EntityManager entityManager) {
        this.shows = new Shows(entityManager);
        this.celebrities = new Celebrities(entityManager);
    }

    public String addShow(String title, String description, String show_type, String director, List<String> actors, Integer seasons) {
        if (title == null || title.isEmpty()) {
            throw new IllegalArgumentException("Title cannot be empty");
        }
        if (!show_type.equals("Movie") && !show_type.equals("TVShow")) {
            throw new IllegalArgumentException("Show type must be Movie or TVShow");
        }

        Show show = new Show(title, description, show_type);

        try {
            show.setDirector(celebrities.findCelebrityByName(director));
        } catch (Exception e) {
            throw new IllegalArgumentException("Director not found");
        }

        try{
            List<Celebrity> actorList = new ArrayList<>();
            for (String actor : actors) {
                actorList.add(celebrities.findCelebrityByName(actor));
            }
            show.setActors(actorList);
        } catch (Exception e) {
            throw new IllegalArgumentException("An actor is not found");
        }

        if (show_type.equals("TVShow")) {
            if (seasons == null) {
                throw new IllegalArgumentException("Seasons is required for TVShow");
            }

            for (int i = 1; i <= seasons; i++) {
                Season season = new Season(i, show);
                show.addSeason(season);
            }
        }

        shows.saveShow(show);
        return show.asJson();
    }

    public String getShow(String title) {
        try {
            Show show = shows.findShowByTitle(title);
            return show.asJson();
        } catch (Exception e) {
            return "Show not found";
        }
    }

    public List<Show> getAllShows() {
        try {
            return shows.findAllShows();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
