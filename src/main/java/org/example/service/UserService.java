package org.example.service;

import org.example.model.*;
import org.example.repository.Celebrities;
import org.example.repository.Shows;
import org.example.repository.Users;
import org.example.utility.AuthUtility;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.regex.Pattern;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.util.Calendar;
import org.apache.commons.mail.*;


public class UserService {
    private final Users users;
    private final Shows shows;
    private final Celebrities celebrities;

    public UserService() {
        this.users = new Users();
        this.shows = new Shows();
        this.celebrities = new Celebrities();
    }

    public String updateImage(String token, String fullObjectKey, Long id) {
        Long userId = AuthUtility.getUserIdFromToken(token);
        if (userId == null) {
            throw new IllegalArgumentException("Invalid token");
        }
        if (!userId.equals(id)) {
            throw new IllegalArgumentException("Cant modify image from another user");
        }

        User user = users.findUserById(id);
        user.setImage(fullObjectKey);
        users.update(user);
        return user.asJson();
    }

    public String signup(String email, String username, String password) {
        // Validate user data
        if (email == null || username == null || password == null) {
            throw new IllegalArgumentException("Missing data");
        }

        if (!isValidEmail(email)) {
            throw new IllegalArgumentException("Invalid email");
        }

        User existingEmail = users.findUserByEmail(email);
        if (existingEmail != null) {
            throw new IllegalArgumentException("Email already in use");
        }

        User existingUser = users.findUserByUsername(username);
        if (existingUser != null) {
            throw new IllegalArgumentException("Username already in use");
        }

        if(username.length() < 4){
            throw new IllegalArgumentException("Username must be at least 4 characters long");
        }

        if (password.length() < 8){
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }

        User user = new User(email, username, password);
        users.persist(user);
        return user.asJson();
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        Pattern pat = Pattern.compile(emailRegex);
        return pat.matcher(email).matches();
    }

    public String signin(String username, String password) {
        User user = users.findUserByUsername(username);
        if (user == null || !user.getPassword().equals(password)) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        // Create a Calendar object
        Calendar calendar = Calendar.getInstance();
        // Add 2 hour to the current time
        calendar.add(Calendar.HOUR, 2);

        // Create a new JWT with an expiration time
        String token = JWT.create()
                .withClaim("userId", user.getUserId())
                .withExpiresAt(calendar.getTime()) // Set the expiration time
                .sign(Algorithm.HMAC256("secret"));

        // Return the token to the client
        JsonObject userJson = JsonParser.parseString(user.asJson()).getAsJsonObject();
        userJson.addProperty("token", token);

        return userJson.toString();
    }

    public String getUser(Long userId) {
        try {
            User user = users.findUserById(userId);
            return user.asJson();
        } catch (Exception e) {
            return "User not found";
        }
    }

    public String getCurrentUser(String token) {
        try {
            // Use AuthUtility to get the userId from the token
            Long userId = AuthUtility.getUserIdFromToken(token);

            if (userId == null) {
                return "Invalid token";
            }

            User user = users.findUserById(userId);
            return user.asJson();
        } catch (JWTVerificationException exception) {
            // Invalid or expired token
            return "Not signed in or token expired";
        }
    }

    public String getLikedReviews(String userId) {
        User user = users.findUserById(Long.valueOf(userId));
        if (user == null) {
            return "User not found";
        }

        return user.asJson();
    }

    public List<String> getUserReviews(Long userId) {
        User user = users.findUserById(userId);
        List<String> jsonList = new ArrayList<>();
        for (Review review : user.getReviews()) {
            jsonList.add(review.asJson());
        }
        return jsonList;
    }

    public String deleteUser(Long userId) {
        User user = users.findUserById(userId);
        users.removeUserFromFollowings(user);
        users.removeLikesFromReviews(user);
        users.update(user);
        users.delete(user);
        return "User deleted";
    }

    public String updateUser(String token, String username, String email, String password) {
        Long userId = AuthUtility.getUserIdFromToken(token);
        if (userId == null) {
            throw new IllegalArgumentException("Invalid token");
        }


        User user = users.findUserById(userId);
        if (users.findUserByUsername(username) != null && !user.getUsername().equals(username)) {
            throw new IllegalArgumentException("Username already in use");
        } else if (username.length() < 4) {
            throw new IllegalArgumentException("Username must be at least 4 characters long");
        } else {
            user.setUsername(username);
        }

        if (users.findUserByEmail(email) != null && !user.getEmail().equals(email)) {
            throw new IllegalArgumentException("Email already in use");
        } else {
            user.setEmail(email);
        }

        if (!password.equals(user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        users.update(user);
        return user.asJson();
    }

    public String updatePassword(String token, String currentPassword, String newPassword) {
        Long userId = AuthUtility.getUserIdFromToken(token);
        if (userId == null) {
            throw new IllegalArgumentException("Invalid token");
        }

        User user = users.findUserById(userId);
        if (!user.getPassword().equals(currentPassword)) {
            throw new IllegalArgumentException("Incorrect current password");
        }

        if (newPassword.length() < 8) {
            throw new IllegalArgumentException("New password must be at least 8 characters long");
        }

        user.setPassword(newPassword);
        users.update(user);
        return user.asJson();
    }

    public List<String> getSearchedUsersList(String search) {
        List<User> userList = users.getUsersWithPrefix(search);
        List<String> returnUsers = new ArrayList<>();
        for (User user : userList) {
            returnUsers.add(user.asJson());
        }
        return returnUsers;
    }

    public List<String> getWishlist(Long userId) {
        User user = users.findUserById(userId);
        List<Show> wishlist = user.getWishlist();
        List<String> jsonList = new ArrayList<>();
        for (Show show : wishlist) {
            jsonList.add(show.asJson());
        }
        return jsonList;
    }

    public String addToWishlist(String token, Long showId) {
        Long userId = AuthUtility.getUserIdFromToken(token);
        User user = users.findUserById(userId);
        Show show = shows.findShowById(showId);
        user.addToWishlist(show);
        users.update(user);
        return show.asJson();
    }

    public String removeFromWishlist(String token, Long showId) {
        Long userId = AuthUtility.getUserIdFromToken(token);
        User user = users.findUserById(userId);
        Show show = shows.findShowById(showId);
        user.removeFromWishlist(show);
        users.update(user);
        return show.asJson();
    }

    public String followUser(String token, Long userId) {
        Long followerId = AuthUtility.getUserIdFromToken(token);
        if (userId == null) {
            throw new IllegalArgumentException("Invalid user id");
        }
        if (followerId == null) {
            throw new IllegalArgumentException("Invalid token");
        }
        if (followerId.equals(userId)) {
            throw new IllegalArgumentException("Cannot follow yourself");
        }

        User follower = users.findUserById(followerId);
        User user = users.findUserById(userId);
        if (follower.getFollows().contains(user)) {
            throw new IllegalArgumentException("User is already followed");
        }

        follower.followUser(user);
        users.update(follower);
        users.update(user);
        return "Successfully followed user";
    }

    public String unfollowUser(String token, Long userId) {
        Long followerId = AuthUtility.getUserIdFromToken(token);
        if (userId == null) {
            throw new IllegalArgumentException("Invalid user id");
        }
        if (followerId == null) {
            throw new IllegalArgumentException("Invalid token");
        }
        if (followerId.equals(userId)) {
            throw new IllegalArgumentException("Cannot unfollow yourself");
        }
        if (users.findUserById(userId) == null) {
            throw new IllegalArgumentException("User not found");
        }

        User follower = users.findUserById(followerId);
        User user = users.findUserById(userId);
        if (!follower.getFollows().contains(user)) {
            throw new IllegalArgumentException("User is not followed");

        }

        follower.unfollowUser(user);
        users.update(follower);
        users.update(user);
        return "Successfully unfollowed user";
    }

    public String validateToken(String token) {
        try {
            Long userId = AuthUtility.getUserIdFromToken(token);
            if (userId == null) {
                return "Invalid token";
            }
            return "Valid token";
        } catch (JWTVerificationException exception) {
            return "Invalid token";
        }
    }

    public String recoverPassword(String email) {
        User user = users.findUserByEmail(email);
        if (user == null) throw new IllegalArgumentException("No users with that email");
        String host = "smtp.gmail.com";
        int port = 587;
        String username = "cinemunityofficial@gmail.com";
        String password = "ftap umii bcnz wcav";

        // Creación del objeto Email
        Email myEmail = new SimpleEmail();
        myEmail.setHostName(host);
        myEmail.setSmtpPort(port);
        myEmail.setAuthenticator(new DefaultAuthenticator(username, password));
        myEmail.setStartTLSEnabled(true);

        try {
            // Configuración del remitente, destinatario, asunto y cuerpo del mensaje
            user.setPassword(generateRandomPassword());
            myEmail.setFrom(username);
            myEmail.setSubject("Password Recovery");
            myEmail.setMsg("Hello! We have received a request to recover your password. Your password is: "
                    + user.getPassword()
                    + "\n\nCinemunity Team");
            myEmail.addTo(email);

            // Envío del correo electrónico
            myEmail.send();
            System.out.println("¡Correo electrónico enviado correctamente!");
            users.update(user);
        } catch (EmailException e) {
            e.printStackTrace();
        }
        return "ok";
    }

    public String generateRandomPassword() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random rnd = new Random();
        StringBuilder password = new StringBuilder(8);

        for (int i = 0; i < 8; i++) {
            password.append(characters.charAt(rnd.nextInt(characters.length())));
        }

        return password.toString();
    }

    public String verifyUser(Long userId) {
        User user = users.findUserById(userId);
        user.changeVerified();
        users.update(user);
        return "change verification";
    }

    public String getFollowers(String token, Long userId) {
        Long currentUserId = AuthUtility.getUserIdFromToken(token);
        if (currentUserId == null) {
            throw new IllegalArgumentException("Invalid token");
        }
        User user = users.findUserById(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        List<User> followers = user.getFollowers();
        List<String> jsonList = new ArrayList<>();
        for (User follower : followers) {
            jsonList.add(follower.asJson());
        }
        return jsonList.toString();
    }

    public String getFollowing(String token, Long userId) {
        Long currentUserId = AuthUtility.getUserIdFromToken(token);
        if (currentUserId == null) {
            throw new IllegalArgumentException("Invalid token");
        }
        User user = users.findUserById(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        List<User> following = user.getFollows();
        List<String> jsonList = new ArrayList<>();
        for (User followed : following) {
            jsonList.add(followed.asJson());
        }
        return jsonList.toString();
    }

    public String getPeopleWithPrefix(String prefix) {
        List<User> userList = users.getUsersWithPrefix(prefix);
        List<String> resultList = new ArrayList<>();
        for (User user : userList) {
            resultList.add(user.asJson());
        }
        List<Celebrity> celebrityList = celebrities.getCelebrityWithPrefix(prefix);
        for (Celebrity celebrity : celebrityList) {
            resultList.add(celebrity.asJson());
        }
        return resultList.toString();
    }

    public List<String> getNotifications(String token){
        Long userId = AuthUtility.getUserIdFromToken(token);
        if (userId == null) {
            throw new IllegalArgumentException("Invalid token");
        }
        User user = users.findUserById(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        List<Notification> notificationList = user.getNotificationList();
        List<String> jsonList = new ArrayList<>();
        for (Notification notification : notificationList) {
            jsonList.add(notification.asJson());
        }
        return jsonList;
    }
}
