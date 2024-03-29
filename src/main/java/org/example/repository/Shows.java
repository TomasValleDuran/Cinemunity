package org.example.repository;

import org.example.model.Celebrity;
import org.example.model.Show;
import org.example.model.Season;
import org.example.model.User;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

public class Shows {
    private EntityManager entityManager;

    public Shows(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Show findShowById(Long id) {
        return entityManager.find(Show.class, id);
    }

    public Show findShowByTitle(String title) {
        TypedQuery<Show> query = entityManager.createQuery("SELECT s " +
                "FROM Show s " +
                "WHERE s.title LIKE :title", Show.class);
        query.setParameter("title", title);
        return query.getSingleResult();
    }

    public List<Show> findShowByType(String show_type) {
        TypedQuery<Show> query = entityManager.createQuery("SELECT s " +
                "FROM Show s " +
                "WHERE s.show_type LIKE :show_type", Show.class);
        query.setParameter("show_type", show_type);
        return query.getResultList();
    }

    public List<Season> findSeasonsByShow(Show show) {
        TypedQuery<Season> query = entityManager.createQuery("SELECT s " +
                "FROM Season s " +
                "WHERE s.show = :show", Season.class);
        query.setParameter("show", show);
        return query.getResultList();
    }

    public List<Show> findAllShows() {
        TypedQuery<Show> query = entityManager.createQuery("SELECT s FROM Show s", Show.class);
        return query.getResultList();
    }

    public List<Celebrity> findAllActorsByShow(Show show) {
        TypedQuery<Celebrity> query = entityManager.createQuery("SELECT c " +
                "FROM Celebrity c " +
                "JOIN c.actedShows s " +
                "WHERE s = :show", Celebrity.class);
        query.setParameter("show", show);
        return query.getResultList();
    }

    public Celebrity findDirectorByShow(Show show) {
        TypedQuery<Celebrity> query = entityManager.createQuery("SELECT c " +
                "FROM Celebrity c " +
                "JOIN c.directedShows s " +
                "WHERE s = :show", Celebrity.class);
        query.setParameter("show", show);
        return query.getSingleResult();
    }

    public void saveShow(Show show) {
        entityManager.getTransaction().begin();
        entityManager.persist(show);
        entityManager.getTransaction().commit();
    }

    public void deleteShow(Show show) {
        entityManager.getTransaction().begin();
        entityManager.remove(show);
        entityManager.getTransaction().commit();
    }

    public Show persist(Show show) {
        entityManager.getTransaction().begin();
        entityManager.persist(show);
        entityManager.getTransaction().commit();
        return show;
    }
}
