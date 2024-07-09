package org.example.repository;

import org.example.model.Notification;
import org.example.model.Review;
import org.example.model.User;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.Collection;
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

    public void removeUserFromFollowings(User user){
        List<User> followings = user.getFollows();
        for (User follow : followings){
            follow.getFollowers().remove(user);
        }
        user.overrideEmptyFollowing();

        List<User> followers = user.getFollowers();
        for (User follower : followers) {
            follower.getFollows().remove(user);
        }
        user.overrideEmptyFollowers();
        update(user);
    }

    public void removeLikesFromReviews(User user){
        List<Review> reviews = user.getReviews();
        for (int i = 0; i < reviews.size(); i++) {
            Review review = reviews.get(i);
            List<User> likedBy = review.getLikedBy();
            for (int j = 0; j < likedBy.size(); j++) {
                User liker = likedBy.get(j);
                liker.unlikeReview(review);
                review.unlikeReview(liker);
                update(liker);
            }
            update(user);
        }
        Collection<Review> likes = user.getLikes();
        for (int i = 0; i < likes.size(); i++) {
            Review like = (Review) likes.toArray()[i];
            like.unlikeReview(user);
            user.unlikeReview(like);
            update(user);
        }
    }

    public List<User> getUsersWithPrefix(String search) {
        TypedQuery<User> query = currentEntityManager().createQuery("SELECT u " +
                "FROM User u " +
                "WHERE LOWER(u.username) LIKE LOWER(:search)", User.class);
        query.setParameter("search", search.toLowerCase() + "%");
        return query.getResultList();
    }

    public void persistNotification(Notification notification) {
        EntityManager entityManager = currentEntityManager();
        entityManager.getTransaction().begin();
        entityManager.persist(notification);
        entityManager.getTransaction().commit();
    }

    public Notification findNotificationById(Long notificationId) {
        TypedQuery<Notification> query = currentEntityManager().createQuery("SELECT n " +
                "FROM Notification n " +
                "WHERE n.notificationId = :notificationId", Notification.class);
        query.setParameter("notificationId", notificationId);
        if (query.getResultList().isEmpty()) {
            return null;
        }
        return query.getSingleResult();
    }

    public void updateNotification(Notification notification) {
        EntityManager entityManager = currentEntityManager();
        entityManager.getTransaction().begin();
        entityManager.merge(notification);
        entityManager.getTransaction().commit();
    }

    public void deleteNotification(Notification notification) {
        EntityManager entityManager = currentEntityManager();
        entityManager.getTransaction().begin();
        entityManager.remove(notification);
        entityManager.getTransaction().commit();
    }
}