package org.example.utility;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.example.model.User;
import org.example.repository.Users;
import spark.Request;
import spark.Response;

public class AuthUtility {
    public static Long getUserIdFromToken(String token) {
        try {
            // Decode the JWT
            DecodedJWT jwt = JWT.require(Algorithm.HMAC256("secret"))
                    .build()
                    .verify(token);

            // Retrieve the user ID from the JWT
            return jwt.getClaim("userId").asLong();
        } catch (JWTVerificationException exception) {
            // Invalid or expired token
            System.out.println("Invalid or expired token");
            return null;
        }
    }

    public static String validateAdmin(Request req, Response res) {
        Users users = new Users();
        String token = req.headers("Authorization");
        Long userId = AuthUtility.getUserIdFromToken(token);
        User user = users.findUserById(userId);

        if (user == null) {
            res.status(401);
            return "No user found for token";
        }

        if (!user.isAdmin()) {
            res.status(403);
            return "User is not an admin";
        } else {
            return "Admin";
        }
    }
}
