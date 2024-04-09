package org.example.repository;

import org.example.model.Review;

import javax.persistence.EntityManager;

public class Reviews {
    private EntityManager entityManager;

    public Reviews(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public void saveReview(Review review) {
        entityManager.getTransaction().begin();
        entityManager.persist(review);
        entityManager.getTransaction().commit();
    }

}
