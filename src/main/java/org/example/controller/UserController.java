package org.example.controller;

import com.google.gson.Gson;
import org.example.dto.*;
import org.example.service.UserService;
import spark.Request;
import spark.Response;


public class UserController {
    private final UserService userService;
    private final Gson gson = new Gson();

    public UserController() {
        this.userService = new UserService();
    }

    public String signup(Request req, Response res) {
        SignUpDto signUpDto = gson.fromJson(req.body(), SignUpDto.class);
        String email = signUpDto.getEmail();
        String username = signUpDto.getUsername();
        String password = signUpDto.getPassword();

        res.type("application/json");

        try {
            return userService.signup(email, username, password);
        } catch (Exception e) {
            res.status(400);
            return e.getMessage();
        }
    }

    public String signin(Request req, Response res) {
        SignInDto signInDto = gson.fromJson(req.body(), SignInDto.class);
        String username = signInDto.getUsername();
        String password = signInDto.getPassword();

        res.type("application/json");
        try {
            return userService.signin(username, password);
        } catch (Exception e) {
            res.status(401);
            return e.getMessage();
        }
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

    public String getLikedReviews(Request req, Response res) {
        String username = req.params(":username");

        res.type("application/json");
        return userService.getLikedReviews(username);
    }

    public String deleteUser(Request req, Response res) {
        String token = req.headers("Authorization");
        if (token == null) {
            return "Not signed in";
        }

        res.type("application/json");
        return userService.deleteUser(token);
    }

    public String updateUser(Request req, Response res) {
        String token = req.headers("Authorization");
        if (token == null) {
            return "Not signed in";
        }

        ModifyAccountDto modifyAccountDto = gson.fromJson(req.body(), ModifyAccountDto.class);
        String username = modifyAccountDto.getUsername();
        String email = modifyAccountDto.getEmail();
        String password = modifyAccountDto.getPassword();

        res.type("application/json");
        try {
            return userService.updateUser(token, username, email, password);
        } catch (Exception e) {
            res.status(401);
            return e.getMessage();
        }
    }

    public String updatePassword(Request req, Response res) {
        String token = req.headers("Authorization");
        if (token == null) {
            return "Not signed in";
        }

        ModifyPasswordDto modifyPasswordDto = gson.fromJson(req.body(), ModifyPasswordDto.class);
        String newPassword = modifyPasswordDto.getNewPassword();
        String currentPassword = modifyPasswordDto.getCurrentPassword();

        res.type("application/json");
        try {
            return userService.updatePassword(token, currentPassword, newPassword);
        } catch (Exception e) {
            res.status(401);
            return e.getMessage();
        }
    }

    public Object getWishlist(Request req, Response res) {
        Long userId = Long.valueOf(req.params(":userId"));
        res.type("application/json");
        return userService.getWishlist(userId);
    }

    public String addToWishlist(Request req, Response res){
        AddToWishlistDto addToWishlistDto = gson.fromJson(req.body(), AddToWishlistDto.class);
        Long showId = addToWishlistDto.getShowId();
        String token = req.headers("Authorization");
        res.type("application/json");
        System.out.println(showId);
        return userService.addToWishlist(token, showId);
    }

    public String removeFromWishlist(Request req, Response res){
        Long showId = Long.valueOf(req.params(":showId"));
        String token = req.headers("Authorization");
        res.type("application/json");
        return userService.removeFromWishlist(token, showId);
    }
}