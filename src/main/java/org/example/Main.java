package org.example;

import org.example.model.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.TypedQuery;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory("cinemunityDB");

        final EntityManager entityManager = factory.createEntityManager();

        generateUsers(entityManager);
        generateReview(entityManager, "user1");

        entityManager.close();

        factory.close();
    }

    private static void generateUsers(EntityManager entityManager) {
        entityManager.getTransaction().begin();

        final User user1 = new User("user1", "password1", "user1@gmail.com");
        final User user2 = new User("user2", "password2", "user2@gmail.com");
        entityManager.persist(user1);
        entityManager.persist(user2);

        entityManager.getTransaction().commit();
    }

    private static void generateReview(EntityManager entityManager, String username) {
        entityManager.getTransaction().begin();


        final User user = getUserByUsername(entityManager, username);
        final Review review = new Review(user,"review from user 1", 8);
        entityManager.persist(review);

        entityManager.getTransaction().commit();
    }

    private static User getUserByUsername(EntityManager entityManager, String username) {
        String queryString = "SELECT u FROM User u WHERE u.user_name = :username";
        TypedQuery<User> query = entityManager.createQuery(queryString, User.class);
        query.setParameter("username", username);
        List<User> users = query.getResultList();
        return users.isEmpty() ? null : users.getFirst();
    }
}