package org.example.s3;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class ImageUploader {
    public void uploadImageToS3(String presignedUrlJson, InputStream imageData) throws IOException {
        // Parse the JSON string to get the URL
        JsonObject jsonObject = JsonParser.parseString(presignedUrlJson).getAsJsonObject();
        String presignedUrl = jsonObject.get("url").getAsString();

        URL url = new URL(presignedUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        // Set the request method and headers
        connection.setRequestMethod("PUT");
        connection.setRequestProperty("Content-Type", "image/jpeg");

        // Write the image data to the connection's output stream
        connection.setDoOutput(true);
        try (OutputStream outputStream = connection.getOutputStream()) {
            byte[] buffer = new byte[1024];
            int bytesRead;

            while ((bytesRead = imageData.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
        }

        // Check the response code
        int responseCode = connection.getResponseCode();
        if (responseCode != HttpURLConnection.HTTP_OK) {
            throw new IOException("Failed to upload image: " + connection.getResponseMessage());
        }
    }
}