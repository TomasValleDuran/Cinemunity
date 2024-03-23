package org.example;

import org.example.model.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;


public class Main {
    public static void main(String[] args) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory("cinemunityDB");

        final EntityManager entityManager = factory.createEntityManager();

        testUserFollowsUserAndLikesReview(entityManager);

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

    private static boolean checkCredentials(EntityManager entityManager, String username, String password) {
        User user = entityManager.createQuery(
        "SELECT u FROM User u WHERE u.user_name = :username AND u.password = :password", User.class)
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
            "SELECT u FROM User u WHERE u.user_name = :username AND u.password = :password", User.class)
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

        Movie movie = new Movie("testMovie", "testDescription");
        entityManager.persist(movie);

        Review review = new Review(user1, movie, "testReview", 5);
        entityManager.persist(review);

        user2.like(review);

        user2.addToWishlist(movie);

        user1.follow(user2);
        user2.follow(user1);

        entityManager.getTransaction().commit();
    }
}