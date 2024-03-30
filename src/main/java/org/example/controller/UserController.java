package org.example.controller;

import org.example.model.User;
import org.example.repository.Users;
import spark.Request;
import spark.Response;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.regex.Pattern;

public class UserController {
    private final Users users;

    public UserController(EntityManager entityManager) {
        this.users = new Users(entityManager);
    }

    public String signup(Request req, Response res) {
        final String email = req.queryParams("email");
        final String username = req.queryParams("username");
        final String password = req.queryParams("password");

        if (!isValidEmail(email)) {
            res.status(401); // Unauthorized
            return "Invalid email";
        }

        final User user = new User(email, username, password);
        users.persist(user);

        res.type("application/json");
        return user.asJson();
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        Pattern pat = Pattern.compile(emailRegex);
        return pat.matcher(email).matches();
    }

    public Object signin(Request req, Response res) {
        final String email = req.queryParams("email");
        final String password = req.queryParams("password");

        User user = users.signin(email, password);

        if (req.session().attribute("user_id") != null){
            res.status(401); // Unauthorized
            return "Someone already signed in";
        }

        if (user != null) {
            req.session().attribute("user_id", user.getUserId());
            res.type("application/json");
            return user.asJson();
        } else {
            res.status(401); // Unauthorized
            return "Invalid email or password";
        }
    }

    public Object signout(Request req, Response res) {
        if (req.session().attribute("user_id") == null){
            res.status(401); // Unauthorized
            return "No one is signed in";
        }
        req.session().invalidate();
        return "User signed out";
    }

    public Object getUser(Request req, Response res) {
        final Long userid = Long.valueOf(req.params(":userid"));
        final User user = users.findUserById(userid);

        if (user == null) {
            res.status(404); // Not Found
            return "User not found";
        }

        res.type("application/json");
        return user.asJson();
    }
}