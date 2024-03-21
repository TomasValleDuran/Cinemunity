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

    private static void testUserFollowsUserAndLikesReview(EntityManager entityManager) {
        // Start a new transaction
        entityManager.getTransaction().begin();

        // Create two new users
        User user1 = new User("testUser1", "testPassword1", "testEmail1@test.com");
        User user2 = new User("testUser2", "testPassword2", "testEmail2@test.com");
        entityManager.persist(user1);
        entityManager.persist(user2);

        // Create a new movie
        Movie movie = new Movie("testMovie", "testDescription");
        entityManager.persist(movie);

        // User1 creates a new review on the movie
        Review review = new Review(user1, movie, "testReview", 5);
        entityManager.persist(review);

        // User2 likes the review
        user2.like(review);

        // User2 adds the movie to their wishlist
        user2.addToWishlist(movie);

        // User1 follows User2 and User2 follows User1
        user1.follow(user2);
        user2.follow(user1);

        // Commit the transaction
        entityManager.getTransaction().commit();
    }
}