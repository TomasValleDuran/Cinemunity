package org.example.repository;

import org.example.model.Review;
import org.example.model.User;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;
import static org.example.utility.EntityManagerUtil.currentEntityManager;


public class Users {

    public Users() {}

    public User findUserById(Long id) {
        return currentEntityManager().find(User.class, id);
    }

    public User findUserByEmail(String email) {
        TypedQuery<User> query = currentEntityManager().createQuery("SELECT u " +
                "FROM User u " +
                "WHERE u.email LIKE :email", User.class);
        query.setParameter("email", email);
        if (query.getResultList().isEmpty()) {
            return null;
        }
        return query.getSingleResult();
    }

    public List<User> findAllUsers() {
        TypedQuery<User> query = currentEntityManager().createQuery("SELECT u FROM User u", User.class);
        return query.getResultList();
    }

    public User signin(String email, String password) {
        TypedQuery<User> query = currentEntityManager().createQuery("SELECT u " +
                "FROM User u " +
                "WHERE u.email LIKE :email AND u.password LIKE :password", User.class);
        query.setParameter("email", email);
        query.setParameter("password", password);
        return query.getSingleResult();
    }

    public User findUserByUsername(String username) {
        TypedQuery<User> query = currentEntityManager().createQuery("SELECT u " +
                "FROM User u " +
                "WHERE u.username LIKE :username", User.class);
        query.setParameter("username", username);
        if (query.getResultList().isEmpty()) {
            return null;
        }
        return query.getSingleResult();
    }

    public List<Review> findAllReviewsByUser(User user) {
        TypedQuery<Review> query = currentEntityManager().createQuery("SELECT r " +
                "FROM Review r " +
                "WHERE r.user = :user", Review.class);
        query.setParameter("user", user);
        return query.getResultList();
    }

    public List<User> findAllFollowersByUser(User user) {
        TypedQuery<User> query = currentEntityManager().createQuery("SELECT u " +
                "FROM User u " +
                "JOIN u.following f " +
                "WHERE f = :user", User.class);
        query.setParameter("user", user);
        return query.getResultList();
    }

    public List<User> findAllFollowingByUser(User user) {
        TypedQuery<User> query = currentEntityManager().createQuery("SELECT u " +
                "FROM User u " +
                "JOIN u.following f " +
                "WHERE f = :user", User.class);
        query.setParameter("user", user);
        return query.getResultList();
    }

    public void deleteUser(User user) {
        EntityManager entityManager = currentEntityManager();
        entityManager.getTransaction().begin();
        entityManager.remove(user);
        entityManager.getTransaction().commit();
    }

    public void persist(User user) {
        EntityManager entityManager = currentEntityManager();
        entityManager.getTransaction().begin();
        entityManager.persist(user);
        entityManager.getTransaction().commit();
    }

    public User findUserByEmailOrUsername(String email, String username) {
        TypedQuery<User> query = currentEntityManager().createQuery("SELECT u " +
                "FROM User u " +
                "WHERE u.email LIKE :email OR u.username LIKE :username", User.class);
        query.setParameter("email", email);
        query.setParameter("username", username);
        List<User> users = query.getResultList();
        if (users.isEmpty()) {
            return null;
        }
        return users.getFirst();
    }

    public void update(User user) {
        EntityManager entityManager = currentEntityManager();
        entityManager.getTransaction().begin();
        entityManager.merge(user);
        entityManager.getTransaction().commit();
    }

    public void delete(User user) {
        EntityManager entityManager = currentEntityManager();
        entityManager.getTransaction().begin();
        entityManager.remove(user);
        entityManager.getTransaction().commit();
    }

    public List<User> getUsersWithPrefix(String search) {
        TypedQuery<User> query = currentEntityManager().createQuery("SELECT u " +
                "FROM User u " +
                "WHERE u.username LIKE :search", User.class);
        query.setParameter("search", search + "%");
        return query.getResultList();
    }
}