package org.example;

import org.example.controller.CelebrityController;
import org.example.controller.ShowController;
import org.example.controller.UserController;
import org.example.controller.ReviewController;
import org.example.s3.ImageController;
import spark.*;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import static org.example.utility.EntityManagerUtil.setFactory;
import static org.example.utility.EntityManagerUtil.closeCurrentEntityManager;
import static spark.Spark.*;

public class Aplication {
    public static void main(String[] args) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory("cinemunityDB");
        setFactory(factory);

        final UserController userController = new UserController();
        final ShowController showController = new ShowController();
        final CelebrityController celebrityController = new CelebrityController();
        final ReviewController reviewController = new ReviewController();
        final ImageController imageController = new ImageController();

        Spark.port(3333);

        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));

        Spark.get("/api/user/validateToken", userController::validateToken);
        Spark.get("/api/user/currentUser", userController::getCurrentUser);
        Spark.post("/api/user/signup", userController::signup);
        Spark.post("/api/user/signin", userController::signin);
        Spark.get("/api/user/get/:userId", userController::getUser);
        Spark.get("/api/user/getLikedReviews/:username", userController::getLikedReviews);
        Spark.delete("/api/user/deleteUser", userController::deleteUser);
        Spark.put("/api/user/updateUserInfo", userController::updateUser);
        Spark.put("/api/user/updatePassword", userController::updatePassword);
        Spark.get("/api/user/search/:search", userController::getSearchedUsersList);
        Spark.post("/api/user/follow", userController::followUser);
        Spark.post("/api/user/unfollow", userController::unfollowUser);
        Spark.post("/api/user/forgotpassword", userController::recoverPassword);

        Spark.post("/api/show/addShow", showController::addShow);
        Spark.get("/api/show/get/:showId", showController::getShow);
        Spark.get("/api/show/getAll", showController::getAllShows);
        Spark.get("/api/Movie/search/:search", showController::getSearchedShowsList);
        Spark.get("/api/TVShow/search/:search", showController::getSearchedShowsList);

        Spark.post("/api/celebrity/addCelebrity", celebrityController::addCelebrity);
        Spark.get("/api/celebrity/get/:celebrityId", celebrityController::getCelebrity);
        Spark.get("/api/celebrity/search/:search", celebrityController::getSearchedCelebrityList);

        Spark.post("/api/review/addReview", reviewController::addReview);
        Spark.post("/api/review/getReviewsByIds", reviewController::getReviewsByIds);
        Spark.put("/api/review/likeReview/:reviewId", reviewController::likeReview);
        Spark.put("/api/review/unlikeReview/:reviewId", reviewController::unlikeReview);
        Spark.delete("/api/review/deleteReview/:reviewId", reviewController::deleteReview);

        Spark.get("/api/user/wishlist/:userId", userController::getWishlist);
        Spark.post("/api/user/wishlist", userController::addToWishlist);
        Spark.delete("/api/user/wishlist/:showId", userController::removeFromWishlist);

        Spark.post("/api/upload", imageController::generatePresignedUrl);
        Spark.put("/api/user/updateImage", userController::updateImage);
        Spark.put("/api/celebrity/updateImage", celebrityController::updateImage);
        Spark.put("/api/show/updateImage", showController::updateImage);
        Spark.delete("/api/deleteImage", imageController::deleteImage);


        after((request, response) -> closeCurrentEntityManager());
    }
}