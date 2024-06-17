package org.example.tmdb;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import java.io.IOException;

public class TMDbService {
    private static final String API_KEY = "5797bfe38db9341ecbb67c0671a10c31";
    private final OkHttpClient client = new OkHttpClient();

    public String searchActor(String actorName) throws IOException {
        String url = "https://api.themoviedb.org/3/search/person?api_key=" + API_KEY + "&query=" + actorName;
        Request request = new Request.Builder().url(url).build();
        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        }
    }

    public String getActorDetails(int actorId) throws IOException {
        String url = "https://api.themoviedb.org/3/person/" + actorId + "?api_key=" + API_KEY;
        Request request = new Request.Builder().url(url).build();
        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        }
    }

    public String searchMovie(String movieName) {
        String url = "https://api.themoviedb.org/3/search/movie?api_key=" + API_KEY + "&query=" + movieName;
        Request request = new Request.Builder().url(url).build();
        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String getMovieDetails(int movieId) {
        String url = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + API_KEY + "&append_to_response=credits";
        Request request = new Request.Builder().url(url).build();
        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String searchTvShow(String showName) {
        String url = "https://api.themoviedb.org/3/search/tv?api_key=" + API_KEY + "&query=" + showName;
        Request request = new Request.Builder().url(url).build();
        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String getTvShowDetails(int showId) {
        String url = "https://api.themoviedb.org/3/tv/" + showId + "?api_key=" + API_KEY + "&append_to_response=credits";
        Request request = new Request.Builder().url(url).build();
        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
