package org.example.services;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.example.model.*;

public class SignupService {
    @WebServlet("/signup.do")
    public class Signup extends HttpServlet {

        @Override
        protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
            final User user = new User(req.getParameter("email"),req.getParameter("firsntame"), req.getParameter("password"));
            Users users = new Users<>();
            users.persist(user);

            final RequestDispatcher view = req.getRequestDispatcher("login.html");

            view.forward(req, resp);
        }
}
