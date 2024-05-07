package org.example.s3;

import com.google.gson.Gson;
import org.example.dto.ImageDto;
import spark.Request;
import spark.Response;

public class ImageController {
    private final Gson gson = new Gson();

    public ImageController() {
    }

    public String generatePresignedUrl(Request req, Response res) {
        ImageDto imageDto = gson.fromJson(req.body(), ImageDto.class);
        String folder = imageDto.getFolder();
        String objectKey = imageDto.getObjectKey();

        res.type("application/json");
        return PresignedUrlGenerator.generateUrl(folder, objectKey);
    }
}
