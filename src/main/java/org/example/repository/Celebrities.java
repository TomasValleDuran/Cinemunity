package org.example.repository;

import org.example.model.Celebrity;
import org.example.model.Show;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

import static org.example.utility.EntityManagerUtil.currentEntityManager;

public class Celebrities {

    public Celebrities() {
    }

    public Celebrity findCelebrityById(Long id) {
        return currentEntityManager().find(Celebrity.class, id);
    }

    public Celebrity findCelebrityByName(String name) {
        TypedQuery<Celebrity> query = currentEntityManager().createQuery("SELECT c " +
                "FROM Celebrity c " +
                "WHERE c.name LIKE :name", Celebrity.class);
        query.setParameter("name", name);
        return query.getSingleResult();
    }

    public List<Show> findShowsDirectedByCelebrity(Celebrity celebrity) {
        TypedQuery<Show> query = currentEntityManager().createQuery("SELECT s " +
                "FROM Show s " +
                "WHERE s.director = :celebrity", Show.class);
        query.setParameter("celebrity", celebrity);
        return query.getResultList();
    }

    public List<Show> findShowsActedByCelebrity(Celebrity celebrity) {
        TypedQuery<Show> query = currentEntityManager().createQuery("SELECT s " +
                "FROM Show s " +
                "JOIN s.actors c " +
                "WHERE c = :celebrity", Show.class);
        query.setParameter("celebrity", celebrity);
        return query.getResultList();
    }

    public List<Celebrity> findAllCelebrities() {
        TypedQuery<Celebrity> query = currentEntityManager().createQuery("SELECT c FROM Celebrity c", Celebrity.class);
        return query.getResultList();
    }

    public void save(Celebrity celebrity) {
        EntityManager entityManager = currentEntityManager();
        entityManager.getTransaction().begin();
        entityManager.persist(celebrity);
        entityManager.getTransaction().commit();
    }

    public void delete(Celebrity celebrity) {
        EntityManager entityManager = currentEntityManager();
        entityManager.getTransaction().begin();
        entityManager.remove(celebrity);
        entityManager.getTransaction().commit();
    }

    public void update(Celebrity celebrity) {
        EntityManager entityManager = currentEntityManager();
        entityManager.getTransaction().begin();
        entityManager.merge(celebrity);
        entityManager.getTransaction().commit();
    }

    public List<Celebrity> getCelebrityWithPrefix(String search) {
        TypedQuery<Celebrity> query = currentEntityManager().createQuery("SELECT c " +
                "FROM Celebrity c " +
                "WHERE c.name LIKE :search", Celebrity.class);
        query.setParameter("search", search + "%");
        return query.getResultList();
    }
}
