package org.example;

import org.example.controller.CelebrityController;
import org.example.controller.ShowController;
import org.example.controller.UserController;
import org.example.controller.ReviewController;
import org.example.s3.ImageController;
import org.example.tmdb.TMDbController;
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
        final TMDbController tmBdController = new TMDbController();

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

        // USER
        Spark.get("/api/user/validateToken", userController::validateToken);
        Spark.get("/api/user/currentUser", userController::getCurrentUser);
        Spark.post("/api/user/signup", userController::signup);
        Spark.post("/api/user/signin", userController::signin);
        Spark.get("/api/user/get/:userId", userController::getUser);
        Spark.delete("/api/user/deleteUser/:userId", userController::deleteUser);
        Spark.put("/api/user/updateUserInfo", userController::updateUser);
        Spark.put("/api/user/updatePassword", userController::updatePassword);
        Spark.get("/api/user/search/:search", userController::getSearchedUsersList);
        Spark.post("/api/user/follow", userController::followUser);
        Spark.post("/api/user/unfollow", userController::unfollowUser);
        Spark.post("/api/user/forgotpassword", userController::recoverPassword);
        Spark.put("/api/user/verify/:userId", userController::verifyUser);
        Spark.get("/api/user/:userId/followers", userController::getFollowers);
        Spark.get("/api/user/:userId/following", userController::getFollowing);
        Spark.get("/api/user/reviews/:userId", userController::getUserReviews);

        // NOTIFICATIONS
        Spark.get("/api/user/getNotifications", userController::getNotifications);
        Spark.post("/api/user/createNotification", userController::createNotification);
        Spark.put("/api/user/readNotification/:notificationId", userController::readNotification);
        Spark.put("/api/user/unreadNotification/:notificationId", userController::unreadNotification);
        Spark.put("/api/user/readAllNotifications", userController::readAllNotifications);
        Spark.delete("/api/user/deleteNotification/:notificationId", userController::deleteNotification);

        // AUTOCOMPLETE
        Spark.get("/api/search/peopleWithPrefix/:prefix", userController::getPeopleWithPrefix);
        Spark.get("/api/search/showsWithPrefix/:prefix", showController::getShowsByPrefix);

        // SHOW
        Spark.post("/api/show/addShow", showController::addShow);
        Spark.get("/api/show/get/:showId", showController::getShow);
        Spark.get("/api/Movie/search/:search", showController::getSearchedShowsList);
        Spark.get("/api/TVShow/search/:search", showController::getSearchedShowsList);
        Spark.get("/api/show/getAll", showController::getAllShows);
        Spark.get("/api/show/getAllMovies", showController::getAllMovies);
        Spark.get("/api/show/getAllTVShows", showController::getAllTVShows);
        Spark.get("/api/show/getTopRankedMovies", showController::getTopRankedMovies);
        Spark.get("/api/show/getTopRankedTVShows", showController::getTopRankedTVShows);

        // CELEBRITY
        Spark.post("/api/celebrity/addCelebrity", celebrityController::addCelebrity);
        Spark.get("/api/celebrity/get/:celebrityId", celebrityController::getCelebrity);
        Spark.get("/api/celebrity/search/:search", celebrityController::getSearchedCelebrityList);
        Spark.get("/api/celebrity/directedShows/:celebrityId", celebrityController::getDirectedShows);
        Spark.get("/api/celebrity/actedShows/:celebrityId", celebrityController::getActedShows);
        Spark.post("/api/celebrity/getCelebritiesByIds", celebrityController::getCelebritiesByIds);
        Spark.put("/api/celebrity/modify", celebrityController::modifyCelebrity);

        // REVIEW & REPLY
        Spark.post("/api/review/addReview", reviewController::addReview);
        Spark.get("/api/review/get/:reviewId", reviewController::getReview);
        Spark.post("/api/review/getReviewsByIds", reviewController::getReviewsByIds);
        Spark.put("/api/review/likeReview/:reviewId", reviewController::likeReview);
        Spark.put("/api/review/unlikeReview/:reviewId", reviewController::unlikeReview);
        Spark.delete("/api/review/deleteReview/:reviewId", reviewController::deleteReview);
        Spark.post("/api/review/addReply", reviewController::addReply);
        Spark.post("/api/review/getReplies", reviewController::getReplies);
        Spark.delete("/api/review/deleteReply/:replyId", reviewController::deleteReply);

        // WISHLIST
        Spark.get("/api/user/wishlist/:userId", userController::getWishlist);
        Spark.post("/api/user/wishlist", userController::addToWishlist);
        Spark.delete("/api/user/wishlist/:showId", userController::removeFromWishlist);

        // S3 BUCKET
        Spark.post("/api/upload", imageController::generatePresignedUrl);
        Spark.put("/api/user/updateImage", userController::updateImage);
        Spark.put("/api/celebrity/updateImage", celebrityController::updateImage);
        Spark.put("/api/show/updateImage", showController::updateImage);
        Spark.delete("/api/deleteImage", imageController::deleteImage);

        // TMDB
        Spark.get("/api/celebrity/importInfo/:name", tmBdController::searchActor);
        Spark.get("/api/celebrity/importDetails/:celebrityId", tmBdController::getActorDetails);
        Spark.get("/api/movie/importInfo/:name", tmBdController::searchMovie);
        Spark.get("/api/movie/importDetails/:movieId", tmBdController::getMovieDetails);
        Spark.get("/api/tvshow/importInfo/:name", tmBdController::searchTvShow);
        Spark.get("/api/tvshow/importDetails/:tvShowId", tmBdController::getTvShowDetails);


        after((request, response) -> closeCurrentEntityManager());
    }
}