package org.example.repository;

import org.example.model.Celebrity;
import org.example.model.Show;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

public class Celebrities {
    private EntityManager entityManager;

    public Celebrities(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Celebrity findCelebrityById(Long id) {
        return entityManager.find(Celebrity.class, id);
    }

    public Celebrity findCelebrityByName(String name) {
        TypedQuery<Celebrity> query = entityManager.createQuery("SELECT c " +
                "FROM Celebrity c " +
                "WHERE c.name LIKE :name", Celebrity.class);
        query.setParameter("name", name);
        return query.getSingleResult();
    }

    public List<Show> findShowsDirectedByCelebrity(Celebrity celebrity) {
        TypedQuery<Show> query = entityManager.createQuery("SELECT s " +
                "FROM Show s " +
                "WHERE s.director = :celebrity", Show.class);
        query.setParameter("celebrity", celebrity);
        return query.getResultList();
    }

    public List<Show> findShowsActedByCelebrity(Celebrity celebrity) {
        TypedQuery<Show> query = entityManager.createQuery("SELECT s " +
                "FROM Show s " +
                "JOIN s.actors c " +
                "WHERE c = :celebrity", Show.class);
        query.setParameter("celebrity", celebrity);
        return query.getResultList();
    }

    public List<Celebrity> findAllCelebrities() {
        TypedQuery<Celebrity> query = entityManager.createQuery("SELECT c FROM Celebrity c", Celebrity.class);
        return query.getResultList();
    }

    public void saveCelebrity(Celebrity celebrity) {
        entityManager.getTransaction().begin();
        entityManager.persist(celebrity);
        entityManager.getTransaction().commit();
    }

    public void deleteCelebrity(Celebrity celebrity) {
        entityManager.getTransaction().begin();
        entityManager.remove(celebrity);
        entityManager.getTransaction().commit();
    }
}
