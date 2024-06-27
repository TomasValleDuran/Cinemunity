package org.example.repository;

import org.example.model.Reply;
import org.example.model.Review;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import java.util.List;

import static org.example.utility.EntityManagerUtil.currentEntityManager;

public class Reviews {

    public Reviews() {}

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

    public List<Reply> findRepliesByIds(List<Long> ids){
        TypedQuery<Reply> query = currentEntityManager().createQuery("SELECT r FROM Reply r WHERE r.replyId IN :ids", Reply.class);
        query.setParameter("ids", ids);
        return query.getResultList();
    }

    public void updateReview(Review review) {
        EntityManager entityManager = currentEntityManager();
        entityManager.getTransaction().begin();
        entityManager.merge(review);
        entityManager.getTransaction().commit();
    }

    public void deleteReview(Long reviewId) {
        EntityManager entityManager = currentEntityManager();
        entityManager.getTransaction().begin();
        Query query = entityManager.createQuery("DELETE FROM Review r WHERE r.reviewId = :id");
        query.setParameter("id", reviewId);
        int deletedCount = query.executeUpdate();
        entityManager.getTransaction().commit();
        if (deletedCount > 0) {
            System.out.println("Review deleted");
        } else {
            System.out.println("No review found with the provided ID");
        }
    }
}
