package org.example.service;

import org.example.model.Celebrity;
import org.example.repository.Celebrities;

import javax.persistence.EntityManager;

public class CelerbrityService {

    private final Celebrities celebrities;

    public CelerbrityService(EntityManager entityManager) {
        this.celebrities = new Celebrities(entityManager);
    }

    public String addCelebrity(String name, String biography) {
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
        if (biography == null || biography.isEmpty()) {
            throw new IllegalArgumentException("Biography cannot be empty");
        }

        Celebrity celebrity = new Celebrity(name, biography);
        celebrities.saveCelebrity(celebrity);
        return celebrity.asJson();
    }

    public String getCelebrity(String name) {
        try {
            Celebrity celebrity = celebrities.findCelebrityByName(name);
            return celebrity.asJson();
        } catch (Exception e) {
            return "Celebrity not found";
        }
    }
}
