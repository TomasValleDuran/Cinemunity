package org.example;

import org.example.model.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class Main {
    public static void main(String[] args) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory("cinemunityDB");

        final EntityManager entityManager = factory.createEntityManager();

        sample1(entityManager);

        entityManager.close();
    }

    private static void sample1(EntityManager entityManager) {
        User luke = new User("Luke", "Skywalker", "luke.skywalker@jedis.org");
        entityManager.getTransaction().begin();
        entityManager.persist(luke);
        entityManager.getTransaction().commit();
    }
}