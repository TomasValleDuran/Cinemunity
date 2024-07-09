package org.example.repository;

import org.example.model.Celebrity;
import org.example.model.Show;
import org.example.model.Season;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

import static org.example.utility.EntityManagerUtil.currentEntityManager;

public class Shows {

    public Shows() {}

    public Show findShowById(Long id) {
        return currentEntityManager().find(Show.class, id);
    }

    public Show findShowByTitle(String title) {
        EntityManager entityManager = currentEntityManager();
        System.out.println(entityManager);
        TypedQuery<Show> query = entityManager.createQuery("SELECT s " +
                "FROM Show s " +
                "WHERE s.title LIKE :title", Show.class);
        query.setParameter("title", title);
        if (query.getResultList().isEmpty()) return null;
        return query.getSingleResult();
    }

    public List<Show> findShowByType(String show_type) {
        TypedQuery<Show> query = currentEntityManager().createQuery("SELECT s " +
                "FROM Show s " +
                "WHERE s.show_type LIKE :show_type", Show.class);
        query.setParameter("show_type", show_type);
        return query.getResultList();
    }

    public List<Season> findSeasonsByShow(Show show) {
        TypedQuery<Season> query = currentEntityManager().createQuery("SELECT s " +
                "FROM Season s " +
                "WHERE s.show = :show", Season.class);
        query.setParameter("show", show);
        return query.getResultList();
    }

    public List<Show> findAllShows() {
        TypedQuery<Show> query = currentEntityManager().createQuery("SELECT s FROM Show s", Show.class);
        return query.getResultList();
    }

    public List<Celebrity> findAllActorsByShow(Show show) {
        TypedQuery<Celebrity> query = currentEntityManager().createQuery("SELECT c " +
                "FROM Celebrity c " +
                "JOIN c.actedShows s " +
                "WHERE s = :show", Celebrity.class);
        query.setParameter("show", show);
        return query.getResultList();
    }

    public Celebrity findDirectorByShow(Show show) {
        TypedQuery<Celebrity> query = currentEntityManager().createQuery("SELECT c " +
                "FROM Celebrity c " +
                "JOIN c.directedShows s " +
                "WHERE s = :show", Celebrity.class);
        query.setParameter("show", show);
        return query.getSingleResult();
    }

    public void save(Show show) {
        EntityManager entityManager = currentEntityManager();
        entityManager.getTransaction().begin();
        entityManager.persist(show);
        entityManager.getTransaction().commit();
    }

    public void delete(Show show) {
        EntityManager entityManager = currentEntityManager();
        entityManager.getTransaction().begin();
        entityManager.remove(show);
        entityManager.getTransaction().commit();
    }

    public List<Show> getShowsWithPrefix(String search, String type) {
        TypedQuery<Show> query = currentEntityManager().createQuery("SELECT s " +
                "FROM Show s " +
                "WHERE LOWER(s.title) LIKE LOWER(:search) " +
                "AND LOWER(s.show_type) LIKE LOWER(:type)", Show.class);
        query.setParameter("search", search.toLowerCase() + "%");
        query.setParameter("type", type.toLowerCase());
        return query.getResultList();
    }


    public void update(Show show) {
        EntityManager entityManager = currentEntityManager();
        entityManager.getTransaction().begin();
        entityManager.merge(show);
        entityManager.getTransaction().commit();
    }

    public List<Show> getShowsByPrefix(String prefix) {
        TypedQuery<Show> query = currentEntityManager().createQuery("SELECT s " +
                "FROM Show s " +
                "WHERE LOWER(s.title) LIKE LOWER(:prefix)", Show.class);
        query.setParameter("prefix", prefix.toLowerCase() + "%");
        return query.getResultList();
    }

    public List<Show> findAllMovies() {
        TypedQuery<Show> query = currentEntityManager().createQuery("SELECT s " +
                "FROM Show s " +
                "WHERE s.show_type = 'Movie'", Show.class);
        return query.getResultList();
    }

    public List<Show> findAllTVShows() {
        TypedQuery<Show> query = currentEntityManager().createQuery("SELECT s " +
                "FROM Show s " +
                "WHERE s.show_type = 'TVShow'", Show.class);
        return query.getResultList();
    }

    public List<Show> getTopRankedMovies() {
        TypedQuery<Show> query = currentEntityManager().createQuery("SELECT s " +
                "FROM Show s " +
                "WHERE s.show_type = 'Movie' " +
                "ORDER BY s.rating DESC", Show.class);
        return query.getResultList();
    }

    public List<Show> getTopRankedTVShows() {
        TypedQuery<Show> query = currentEntityManager().createQuery("SELECT s " +
                "FROM Show s " +
                "WHERE s.show_type = 'TVShow' " +
                "ORDER BY s.rating DESC", Show.class);
        return query.getResultList();
    }
}
