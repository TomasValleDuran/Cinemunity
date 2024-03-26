package org.example;
import com.google.gson.Gson;
import org.example.model.User;
import spark.Spark;
import com.google.common.base.Strings;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

import java.time.Instant;

import static spark.Spark.*;

public class Aplication {
    private static final Gson gson = new Gson();
    public static void main(String[] args) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory("cinemunityDB");
        final EntityManager entityManager = factory.createEntityManager();

        Spark.port(3333);

        Spark.get("/", (req, res) -> "Hello World");
        Spark.get("/hello", (req, res) -> "Hello World");

        Spark.get("/web/v1", (req, res) -> {
            final String now = Instant.now().toString();
            return "<!DOCTYPE html>\n" +
                    "<html lang=\"en\">\n" +
                    "<head>\n" +
                    "  <meta charset=\"UTF-8\">\n" +
                    "  <title>Server side rendering v1</title>\n" +
                    "</head>\n" +
                    "<body>\n" +
                    "\n" +
                    "  <h1>Hora actual</h1>\n" +
                    "  <h3>" + now + "</h3>  \n" +
                    "\n" +
                    "</body>\n" +
                    "</html>";
        });

        Spark.get("/users/:name", (req, res) -> {
            final String name = capitalized(req.params("name"));

            Main.createUser(entityManager,name, "password",name + "@gmail.com");

            res.type("application/json");

            return "<!DOCTYPE html>\n" +
                    "<html lang=\"en\">\n" +
                    "<head>\n" +
                    "  <meta charset=\"UTF-8\">\n" +
                    "</head>\n" +
                    "<body>\n" +
                    "\n" +
                    "Name: " +
                    name + "\n" +
                    "USER CREATED!"+
                    "\n" +
                    "</body>\n" +
                    "</html>";
        });
    }

    private static String capitalized(String name) {
        return Strings.isNullOrEmpty(name) ? name : name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
    }
}
