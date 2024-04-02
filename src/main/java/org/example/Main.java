package org.example;

import org.example.model.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;


public class Main {
    public static void main(String[] args) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory("cinemunityDB");
        final EntityManager entityManager = factory.createEntityManager();

        createAdminUser(entityManager);

        entityManager.close();

        factory.close();
    }

    public static void createAdminUser(EntityManager entityManager) {
        User user = new User("admin@gmail.com", "admin", "admin");
        user.setAdmin();
        entityManager.getTransaction().begin();
        entityManager.persist(user);
        entityManager.getTransaction().commit();
    }
}