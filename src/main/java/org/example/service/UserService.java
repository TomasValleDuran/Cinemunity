package org.example.service;

import org.example.model.User;
import org.example.repository.Users;
import spark.Request;
import javax.persistence.EntityManager;
import java.util.regex.Pattern;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.util.Date;
import java.util.Calendar;

public class UserService {
    private final Users users;

    public UserService(EntityManager entityManager) {
        this.users = new Users(entityManager);
    }

    public String signup(String email, String username, String password) {
        // Validate user data
        if (email == null || username == null || password == null) {
            return "Invalid user data";
        }

        if (!isValidEmail(email)) {
            return "Invalid email";
        }

        User existingUser = users.findUserByEmailOrUsername(email, username);
        if (existingUser != null) {
            return "User already exists";
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
            return "Invalid username or password";
        }

        // Create a Calendar object
        Calendar calendar = Calendar.getInstance();
        // Add 1 hour to the current time
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

    public String getCurrentUser(Request req) {
        String token = req.headers("Authorization");
        if (token == null) {
            return "Not signed in";
        }

        try {
            // Decode the JWT
            DecodedJWT jwt = JWT.require(Algorithm.HMAC256("secret"))
                    .build()
                    .verify(token);

            // Retrieve the user ID from the JWT
            Long userId = jwt.getClaim("userId").asLong();

            User user = users.findUserById(userId);
            return user.asJson();
        } catch (JWTVerificationException exception) {
            // Invalid or expired token
            return "Not signed in or token expired";
        }
    }
}
