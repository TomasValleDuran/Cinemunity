package org.example.s3;

import com.amazonaws.HttpMethod;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.google.gson.Gson;
import org.example.dto.PresignedUrlResponseDto;
import java.net.URL;
import java.time.Instant;
import java.util.Date;

public class PresignedUrlGenerator {
    private static final Gson gson = new Gson();

    // el folder tiene que ser "Shows/" o "Users/"
    public static String generateUrl(String folder, String objectKey) {
        String bucketName = "cinemunitybucket";
        Instant timestamp = Instant.now();
        String fullObjectKey = folder + timestamp.toString() + "-" + objectKey;

        AmazonS3 s3Client = AmazonS3ClientBuilder
                .standard()
                .withRegion(Regions.US_EAST_1)
                .build();

        // Set the expiration time for the presigned URL
        Date expiration = new Date();
        long expTimeMillis = expiration.getTime();
        expTimeMillis += 1000 * 60 * 60; // 1 hour
        expiration.setTime(expTimeMillis);

        // Generate the presigned URL
        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucketName, fullObjectKey)
                        .withMethod(HttpMethod.PUT)
                        .withExpiration(expiration);
        URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);

        String urlBeforeQuestionMark = url.toString().split("\\?")[0];

        PresignedUrlResponseDto responseDto = new PresignedUrlResponseDto(urlBeforeQuestionMark, fullObjectKey);
        return gson.toJson(responseDto);


    }
}

