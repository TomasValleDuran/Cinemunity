package org.example.repository;

import org.example.model.Review;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

import static org.example.utility.EntityManagerUtil.currentEntityManager;

public class Reviews {

    public Reviews() {}

    /*public List<Review> findAllReviews(Long id) {
        TypedQuery<Review> query = entityManager.createQuery("SELECT Review FROM Review WHERE Review.show.showId = :id", Review.class);
        query.setParameter("id", id);
        return query.getResultList();
    }*/

    public List<Review> findReviewsByIds(List<Long> ids) {
        TypedQuery<Review> query = currentEntityManager().createQuery("SELECT r FROM Review r WHERE r.id IN :ids", Review.class);
        query.setParameter("ids", ids);
        return query.getResultList();
    }

    public void saveReview(Review review) {
        EntityManager entityManager = currentEntityManager();
        entityManager.getTransaction().begin();
        entityManager.persist(review);
        entityManager.getTransaction().commit();
    }

    public Review getReviewById(long id) {
        TypedQuery<Review> query = currentEntityManager().createQuery("SELECT r " +
                "FROM Review r " +
                "WHERE r.reviewId = :id", Review.class);
        query.setParameter("id", id);
        return query.getSingleResult();
    }
}
