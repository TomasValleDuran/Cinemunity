package org.example.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.model.Celebrity;
import org.example.model.Season;
import org.example.model.Show;
import org.example.repository.Celebrities;
import org.example.repository.Shows;

import java.util.ArrayList;
import java.util.List;

public class ShowService {

    private final Shows shows;
    private final Celebrities celebrities;

    public ShowService() {
        this.shows = new Shows();
        this.celebrities = new Celebrities();
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
                throw new IllegalArgumentException("Seasons field is required for TV Show");
            }

            if (seasons < 1) {
                throw new IllegalArgumentException("Seasons must be greater than 0");
            }

            for (int i = 1; i <= seasons; i++) {
                Season season = new Season(i, show);
                show.addSeason(season);
            }
        }

        shows.saveShow(show);
        return show.asJson();
    }

    public String getShow(Long id) {
        try {
            Show show = shows.findShowById(id);
            return show.asJson();
        } catch (Exception e) {
            return "Show not found";
        }
    }

    public List<String> getAllShows() {
            List<Show> showsList = shows.findAllShows();
            List<String> returnShows = new ArrayList<>();
            for (Show show : showsList) {
                returnShows.add(show.asJson());
            }
            return returnShows;
    }

    public List<String> getSearchedShows(String search, String type) {
        List<Show> showsList = shows.getShowsWithPrefix(search, type);
        List<String> returnShows = new ArrayList<>();
        for (Show show : showsList) {
            returnShows.add(show.asJson());
        }
        return returnShows;
    }
}
