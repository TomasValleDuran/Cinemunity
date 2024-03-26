package org.example;
import org.example.model.User;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;

import java.time.Instant;

import static spark.Spark.*;

public class Aplication {
public static void main(String[] args) {
    get("/", (req, res) -> "Hello World");
    get("/hello", (req, res) -> "Hello World");

get("/web/v1", (req, res) -> {
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

    get("/users/:name", (req, res) -> {
        final String name = capitalized(req.params("name"));

        final User user = User.create(name + "@gmail.com").firstName(name).lastName("Skywalker").build();

        res.type("application/json");

        return user.asJson();
    });

    /* 5. Dynamic Content from Db */
    Spark.get("/persisted-users/:id",
            (req, resp) -> {
                final String id = req.params("id");

                /* Business Logic */
                final EntityManager entityManager = entityManagerFactory.createEntityManager();
                final EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                User user = entityManager.find(User.class, Long.valueOf(id));
                tx.commit();
                entityManager.close();

                resp.type("application/json");
                return user.asJson();
            }
    );
    }

    private static void storedBasicUser(EntityManagerFactory entityManagerFactory) {
        final EntityManager entityManager = entityManagerFactory.createEntityManager();
        final User users = new User();

        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();
        if (users.listAll().isEmpty()) {
            final User luke =
                    User.create("luke.skywalker@jedis.org")
                            .firstName("Luke")
                            .lastName("Skywalker").
                            build();
            final User leia =
                    User.create("leia.skywalker@jedis.org")
                            .firstName("Leia")
                            .lastName("Skywalker")
                            .build();

            users.persist(luke);
            users.persist(leia);
        }
        tx.commit();
        entityManager.close();
    }

    private static String capitalized(String name) {
        return Strings.isNullOrEmpty(name) ? name : name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
    }


}
