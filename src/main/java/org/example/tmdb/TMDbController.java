package org.example.tmdb;

import org.example.model.Celebrity;
import org.example.repository.Celebrities;
import org.example.s3.PresignedUrlGenerator;
import spark.Request;
import spark.Response;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import org.example.s3.ImageUploader;

public class TMDbController {
    private final TMDbService tmDbService = new TMDbService();
    private final Celebrities celebrities = new Celebrities();

    public TMDbController() {
    }

    public String searchActor(Request req, Response res) {
        String actorName = req.params(":name");
        try {
            res.type("application/json");
            return tmDbService.searchActor(actorName);
        } catch (Exception e) {
            res.status(500);
            return "Error: " + e.getMessage();
        }
    }

    public String getActorDetails(Request req, Response res) {
        int actorId = Integer.parseInt(req.params(":celebrityId"));
        try {
            res.type("application/json");
            return tmDbService.getActorDetails(actorId);
        } catch (Exception e) {
            res.status(500);
            return "Error: " + e.getMessage();
        }
    }

    public String searchMovie(Request req, Response res) {
        String movieName = req.params(":name");
        try {
            res.type("application/json");
            return tmDbService.searchMovie(movieName);
        } catch (Exception e) {
            res.status(500);
            return "Error: " + e.getMessage();
        }
    }

    public String getMovieDetails(Request req, Response res) {
        int movieId = Integer.parseInt(req.params(":movieId"));
        try {
            res.type("application/json");
            String movieDetails = tmDbService.getMovieDetails(movieId);
            // Parse movieDetails to get the cast
            JsonObject movieDetailsJson = JsonParser.parseString(movieDetails).getAsJsonObject();
            JsonObject credits = movieDetailsJson.getAsJsonObject("credits");
            JsonArray cast = credits.getAsJsonArray("cast");
            JsonArray crew = credits.getAsJsonArray("crew");

            // For each cast member, check if they exist in your database
            iterateCast(cast);
            // For each crew member, find job == 'Director' and check if they exist in your database
            iterateCrew(crew);
            
            // Create new cast and crew arrays
            JsonArray newCast = makeNewCast(cast);
            JsonArray newCrew = makeNewCrew(crew);
            credits.add("cast", newCast);
            credits.add("crew", newCrew);
            movieDetailsJson.add("credits", credits);
            return movieDetailsJson.toString();
        } catch (Exception e) {
            res.status(500);
            return "Error: " + e.getMessage();
        }
    }

    private JsonArray makeNewCrew(JsonArray crew) {
        JsonArray newCrew = new JsonArray();
        for (int i = 0; i < crew.size(); i++) {
            JsonObject crewMember = crew.get(i).getAsJsonObject();
            if (crewMember.get("job").getAsString().equals("Director")) {
                Celebrity director = celebrities.findCelebrityByName(crewMember.get("name").getAsString());
                if (director != null) {
                    newCrew.add(crewMember);
                    break; // only want 1 director, if there are multiple, just take the first one.
                }
            }
        }
        return newCrew;
    }

    private JsonArray makeNewCast(JsonArray cast) {
        JsonArray newCast = new JsonArray();
        int length = Math.min(cast.size(), 15);
        for (int i = 0; i < length; i++) {
            JsonObject castMember = cast.get(i).getAsJsonObject();
            Celebrity celebrity = celebrities.findCelebrityByName(castMember.get("name").getAsString());
            if (celebrity != null) {
                newCast.add(castMember);
            }
        }
        return newCast;
    }

    private void iterateCrew(JsonArray crew) throws IOException {
        for (int i = 0; i < crew.size(); i++) {
            JsonObject crewMember = crew.get(i).getAsJsonObject();
            if (crewMember.get("job").getAsString().equals("Director")) {
                Celebrity director = celebrities.findCelebrityByName(crewMember.get("name").getAsString());
                if (director == null) {
                    createCelebrity(crewMember);
                }
                break; // solo quiero 1 director, si hay varios me jodo y agarro 1.
            }
        }
    }

    private void iterateCast(JsonArray cast) throws IOException {
        int length = Math.min(cast.size(), 15);
        for (int i = 0; i < length; i++) {
            JsonObject castMember = cast.get(i).getAsJsonObject();
            Celebrity celebrity = celebrities.findCelebrityByName(castMember.get("name").getAsString());
            if (celebrity == null) {
                createCelebrity(castMember);
            }
        }
    }

    private void createCelebrity(JsonObject castMember) throws IOException {
        String actorDetails = tmDbService.getActorDetails(castMember.get("id").getAsInt());
        JsonObject actorDetailsJson = JsonParser.parseString(actorDetails).getAsJsonObject();
        String actorName = actorDetailsJson.get("name").getAsString();

        String actorBiography = actorDetailsJson.get("biography").getAsString().split("\\n", 2)[0];

        if (actorDetailsJson.has("profile_path") && !actorDetailsJson.get("profile_path").isJsonNull()) {
            String actorProfilePath = actorDetailsJson.get("profile_path").getAsString();

            String presignedUrlJson = uploadToS3(actorProfilePath, actorName);
            JsonObject jsonObject = JsonParser.parseString(presignedUrlJson).getAsJsonObject();
            String fullObjectKey = jsonObject.get("fullObjectKey").getAsString();

            celebrities.addCelebrity(actorName, actorBiography, fullObjectKey);
        } else {
            celebrities.addCelebrity(actorName, actorBiography, "");
        }
    }

    private String uploadToS3(String actorProfilePath, String actorName) throws IOException {
        // Download the image from the URL
        String imageUrl = "https://image.tmdb.org/t/p/w500" + actorProfilePath;
        InputStream imageData = new URL(imageUrl).openStream();

        // Generate a presigned URL
        String presignedUrl = PresignedUrlGenerator.generateUrl("Celebrities/", actorName);

        // Upload the image to S3
        ImageUploader uploader = new ImageUploader();
        uploader.uploadImageToS3(presignedUrl, imageData);
        return presignedUrl;
    }

    public String searchTvShow(Request req, Response res) {
        String showName = req.params(":name");
        try {
            res.type("application/json");
            return tmDbService.searchTvShow(showName);
        } catch (Exception e) {
            res.status(500);
            return "Error: " + e.getMessage();
        }
    }

    public String getTvShowDetails(Request req, Response res) {
        int showId = Integer.parseInt(req.params(":tvShowId"));
        try {
            res.type("application/json");
            return tmDbService.getTvShowDetails(showId);
        } catch (Exception e) {
            res.status(500);
            return "Error: " + e.getMessage();
        }
    }
}
