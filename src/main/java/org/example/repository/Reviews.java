package org.example.repository;

import org.example.model.Review;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

public class Reviews {
    private final EntityManager entityManager;

    public Reviews(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public List<Review> findAllReviews(Long id) {
        TypedQuery<Review> query = entityManager.createQuery("SELECT Review FROM Review WHERE Review.show.showId = :id", Review.class);
        query.setParameter("id", id);
        return query.getResultList();
    }

    public void saveReview(Review review) {
        entityManager.getTransaction().begin();
        entityManager.persist(review);
        entityManager.getTransaction().commit();
    }

}
