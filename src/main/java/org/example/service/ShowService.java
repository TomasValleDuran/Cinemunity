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
            return "Title is required";
        }
        if (!show_type.equals("Movie") && !show_type.equals("TVShow")) {
            return "Show type must be movie or TVShow";
        }

        Show show = new Show(title, description, show_type);

        try {
            show.setDirector(celebrities.findCelebrityByName(director));
        } catch (Exception e) {
            return "Director not found";
        }

        try{
            List<Celebrity> actorList = new ArrayList<>();
            for (String actor : actors) {
                actorList.add(celebrities.findCelebrityByName(actor));
            }
            show.setActors(actorList);
        } catch (Exception e) {
            return "An actor is not found";
        }

        if (show_type.equals("TVShow")) {
            if (seasons == null) {
                return "Seasons is required for TVShow";
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
