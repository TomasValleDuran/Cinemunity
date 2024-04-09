package org.example.controller;

import com.google.gson.Gson;
import org.example.dto.SignInDto;
import org.example.dto.SignUpDto;
import org.example.service.UserService;
import spark.Request;
import spark.Response;
import javax.persistence.EntityManager;


public class UserController {
    private final UserService userService;
    private final Gson gson = new Gson();

    public UserController(EntityManager entityManager) {
        this.userService = new UserService(entityManager);
    }

    public String signup(Request req, Response res) {
        SignUpDto signUpDto = gson.fromJson(req.body(), SignUpDto.class);
        String email = signUpDto.getEmail();
        String username = signUpDto.getUsername();
        String password = signUpDto.getPassword();

        res.type("application/json");
        return userService.signup(email, username, password);
    }

    public String signin(Request req, Response res) {
        SignInDto signInDto = gson.fromJson(req.body(), SignInDto.class);
        String username = signInDto.getUsername();
        String password = signInDto.getPassword();

        res.type("application/json");
        return userService.signin(username, password);
    }

    public String getUser(Request req, Response res) {
        final String username = req.params(":username");

        res.type("application/json");
        return userService.getUser(username);
    }

    public String getCurrentUser(Request req, Response res) {
        String token = req.headers("Authorization");
        if (token == null) {
            return "Not signed in";
        }

        res.type("application/json");
        return userService.getCurrentUser(token);
    }
}