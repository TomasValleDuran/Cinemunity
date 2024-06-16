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
}
