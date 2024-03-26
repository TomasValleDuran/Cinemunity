package org.example;

import org.example.model.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;


public class Main {
    public static void main(String[] args) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory("cinemunityDB");
        final EntityManager entityManager = factory.createEntityManager();

        testShowCreation(entityManager);

        entityManager.close();

        factory.close();
    }

    private static void createAdmin(EntityManager entityManager) {
        entityManager.getTransaction().begin();

        User admin = new User("admin", "admin", "admin@gmail.com");
        admin.setAdmin();
        entityManager.persist(admin);

        entityManager.getTransaction().commit();
    }

    public static void createUser(EntityManager entityManager, String username, String password, String email) {
        entityManager.getTransaction().begin();

        User admin = new User("admin", "admin", "admin@gmail.com");
        admin.setAdmin();
        entityManager.persist(admin);

        entityManager.getTransaction().commit();
    }

    private static boolean checkCredentials(EntityManager entityManager, String username, String password) {
        User user = entityManager.createQuery(
        "SELECT u FROM User u WHERE u.username = :username AND u.password = :password", User.class)
        .setParameter("username", username)
        .setParameter("password", password)
        .getResultList()
        .stream()
        .findFirst()
        .orElse(null);

        return user != null;
    }

    private static void logIn(EntityManager entityManager, String username, String password) {
        if (checkCredentials(entityManager, username, password)) {
            User user = entityManager.createQuery(
            "SELECT u FROM User u WHERE u.username = :username AND u.password = :password", User.class)
            .setParameter("username", username)
            .setParameter("password", password)
            .getSingleResult();

            Session.setCurrentUser(user);
        }
    }

    private static void logOut() {
        Session.logout();
    }

    private static void testUserFollowsUserAndLikesReview(EntityManager entityManager) {
        entityManager.getTransaction().begin();

        User user1 = new User("testUser1", "testPassword1", "testEmail1@test.com");
        User user2 = new User("testUser2", "testPassword2", "testEmail2@test.com");
        entityManager.persist(user1);
        entityManager.persist(user2);

        Show movie = new Show("testMovie", "testDescription");
        entityManager.persist(movie);

        Review review = new Review(user1, movie, "testReview", 5);
        entityManager.persist(review);

        user2.like(review);

        user2.addToWishlist(movie);

        user1.follow(user2);
        user2.follow(user1);

        entityManager.getTransaction().commit();
    }

    private static void testCelebrityMovieRelation(EntityManager entityManager) {
        entityManager.getTransaction().begin();

        Celebrity celebrity1 = new Celebrity("Celebrity 1", "Bio 1");
        Celebrity celebrity2 = new Celebrity("Celebrity 2", "Bio 2");
        Celebrity celebrity3 = new Celebrity("Celebrity 3", "Bio 3");

        Show movie1 = new Show("Movie 1", "Description 1");

        movie1.getActors().add(celebrity1);
        movie1.getActors().add(celebrity2);
        movie1.setDirector(celebrity3);

        entityManager.persist(celebrity1);
        entityManager.persist(celebrity2);
        entityManager.persist(celebrity3);
        entityManager.persist(movie1);

        entityManager.getTransaction().commit();
    }

    private static void testShowCreation(EntityManager entityManager) {
        entityManager.getTransaction().begin();

        // Create a Movie (seasons = 0)
        Show movie = new Show("Movie Title", "Movie Description");
        entityManager.persist(movie);

        // Create a TVShow with some seasons
        Show tvShow = new Show("TVShow Title", "TVShow Description");
        entityManager.persist(tvShow);

        // Create some seasons for the TVShow
        Season season1 = new Season(1, 10, tvShow);
        Season season2 = new Season(2, 8, tvShow);
        Season season3 = new Season(3, 9, tvShow);
        entityManager.persist(season1);
        entityManager.persist(season2);
        entityManager.persist(season3);

        // Add the seasons to the TVShow
        tvShow.addSeason(season1);
        tvShow.addSeason(season2);
        tvShow.addSeason(season3);

        entityManager.getTransaction().commit();
    }
}