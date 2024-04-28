package org.example.service;

import org.example.model.User;
import org.example.repository.Users;
import org.example.utility.AuthUtility;
import spark.Request;
import javax.persistence.EntityManager;
import java.util.regex.Pattern;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.util.Calendar;

public class UserService {
    private final Users users;

    public UserService() {
        this.users = new Users();
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

        if(username.length() < 4) {
            throw new IllegalArgumentException("Username must be at least 4 characters long");
        }

        if (password.length() < 4) {
            throw new IllegalArgumentException("Password must be at least 4 characters long");
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

    public String signout(Request req) {
        if (req.session().attribute("userId") == null) {
            return "Not signed in";
        }

        req.session().removeAttribute("userId");
        return "Signed out";
    }

    public String getUser(String username) {
        try {
            User user = users.findUserByUsername(username);
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

    public String getLikedReviews(String username) {
        User user = users.findUserByUsername(username);
        if (user == null) {
            return "User not found";
        }

        return user.asJson();
    }

    public String deleteUser(String token) {
        Long userId = AuthUtility.getUserIdFromToken(token);
        if (userId == null) {
            return "Invalid token";
        }

        User user = users.findUserById(userId);
        users.delete(user);
        return "User deleted";
    }
}
