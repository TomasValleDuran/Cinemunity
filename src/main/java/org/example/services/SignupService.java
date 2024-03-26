package org.example.services;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.example.model.*;
import org.example.repository.*;

@WebServlet("/signup.do")
public class SignupService extends HttpServlet {
    final EntityManager entityManager = Persistence.createEntityManagerFactory("cinemunityDB").createEntityManager();
    Users users = new Users(entityManager);

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
            final User user = new User(req.getParameter("email"),req.getParameter("firsntame"), req.getParameter("password"));

            users.persist(user);

            final RequestDispatcher view = req.getRequestDispatcher("login.html");

            view.forward(req, resp);
        }
}
