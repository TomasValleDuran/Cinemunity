package org.example.repository;

import org.example.model.Review;
import org.example.model.User;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

public class Users {
    private EntityManager entityManager;

    public Users(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public User findUserById(Long id) {
        return entityManager.find(User.class, id);
    }

    public User findUserByEmail(String email) {
        TypedQuery<User> query = entityManager.createQuery("SELECT u " +
                "FROM User u " +
                "WHERE u.email LIKE :email", User.class);
        query.setParameter("email", email);
        return query.getSingleResult();
    }

    public List<User> findAllUsers() {
        TypedQuery<User> query = entityManager.createQuery("SELECT u FROM User u", User.class);
        return query.getResultList();
    }

    public List<Review> findAllReviewsByUser(User user) {
        TypedQuery<Review> query = entityManager.createQuery("SELECT r " +
                "FROM Review r " +
                "WHERE r.user = :user", Review.class);
        query.setParameter("user", user);
        return query.getResultList();
    }

    public List<User> findAllFollowersByUser(User user) {
        TypedQuery<User> query = entityManager.createQuery("SELECT u " +
                "FROM User u " +
                "JOIN u.following f " +
                "WHERE f = :user", User.class);
        query.setParameter("user", user);
        return query.getResultList();
    }

    public List<User> findAllFollowingByUser(User user) {
        TypedQuery<User> query = entityManager.createQuery("SELECT u " +
                "FROM User u " +
                "JOIN u.following f " +
                "WHERE f = :user", User.class);
        query.setParameter("user", user);
        return query.getResultList();
    }

    public void saveUser(User user) {
        entityManager.getTransaction().begin();
        entityManager.persist(user);
        entityManager.getTransaction().commit();
    }

    public void deleteUser(User user) {
        entityManager.getTransaction().begin();
        entityManager.remove(user);
        entityManager.getTransaction().commit();
    }

    public User persist(User user) {
        entityManager.persist(user);
        return user;
    }
}