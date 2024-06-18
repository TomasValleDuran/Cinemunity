package org.example.service;

import org.example.model.Celebrity;
import org.example.model.Show;
import org.example.repository.Celebrities;

import java.util.ArrayList;
import java.util.List;

public class CelerbrityService {

    private final Celebrities celebrities;

    public CelerbrityService() {
        this.celebrities = new Celebrities();
    }

    public String addCelebrity(String name, String biography, String objectKey) {
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
        if (biography == null || biography.isEmpty()) {
            throw new IllegalArgumentException("Biography cannot be empty");
        }
        if (objectKey == null || objectKey.isEmpty()) {
            throw new IllegalArgumentException("Object key cannot be empty");
        }

        if (celebrities.findCelebrityByName(name) != null) {
            throw new IllegalArgumentException("Celebrity already exists");
        }

        Celebrity celebrity = new Celebrity(name, biography, objectKey);
        celebrities.save(celebrity);
        return celebrity.asJson();
    }

    public String getCelebrity(Long celebrityId) {
        try {
            Celebrity celebrity = celebrities.findCelebrityById(celebrityId);
            return celebrity.asJson();
        } catch (Exception e) {
            return "Celebrity not found";
        }
    }

    public List<String> getSearchedCelebrityList(String search) {
        List<Celebrity> celebrityList = celebrities.getCelebrityWithPrefix(search);
        List<String> returnList = new ArrayList<>();
        for (Celebrity celebrity : celebrityList) {
            returnList.add(celebrity.asJson());
        }
        return returnList;
    }

    public String updateImage(String objectKey, Long id) {
        Celebrity celebrity = celebrities.findCelebrityById(id);
        celebrity.setImage(objectKey);
        celebrities.update(celebrity);
        return celebrity.asJson();
    }

    public List<String> getDirectedShows(Long celebrityId) {
        List<Show> showsList = celebrities.getDirectedShows(celebrityId);
        List<String> result = new ArrayList<>();
        for (Show show : showsList) {
            result.add(show.asJson());
        }
        return result;
    }

    public List<String> getActedShows(Long celebrityId) {
        List<Show> showsList = celebrities.getActedShows(celebrityId);
        List<String> result = new ArrayList<>();
        for (Show show : showsList) {
            result.add(show.asJson());
        }
        return result;
    }

    public List<String> getCelebritiesByIds(List<Long> ids) {
        List<String> celebrityList = new ArrayList<>();

        for (Long id : ids){
            Celebrity celebrity = celebrities.findCelebrityById(id);
            celebrityList.add(celebrity.asJson());
        }

        return celebrityList;
    }

    public String modifyCelebrity(Long id, String name, String biography) {
        Celebrity celebrity = celebrities.findCelebrityById(id);
        celebrity.setName(name);
        celebrity.setBiography(biography);
        celebrities.update(celebrity);
        return celebrity.asJson();
    }
}
