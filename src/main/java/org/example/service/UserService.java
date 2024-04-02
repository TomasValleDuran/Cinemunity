package org.example.service;

import org.example.model.User;
import org.example.repository.Users;
import spark.Request;

import javax.persistence.EntityManager;
import java.util.regex.Pattern;

public class UserService {
    private final EntityManager entityManager;
    private final Users users;

    public UserService(EntityManager entityManager) {
        this.entityManager = entityManager;
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

    public String signin(String username, String password, Request req) {
        User user = users.findUserByUsername(username);
        if (user == null || !user.getPassword().equals(password)) {
            return "Invalid username or password";
        }

        if (req.session().attribute("userId") != null) {
            return "Already signed in";
        }

        req.session().attribute("userId", user.getUserId());
        return user.asJson();
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
}
