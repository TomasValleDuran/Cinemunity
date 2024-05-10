package org.example.s3;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import org.example.dto.FullObjectKeyDto;
import org.example.utility.AuthUtility;
import com.amazonaws.regions.Regions;

public class ImageDeleter {
    public static String deleteImage(String token, FullObjectKeyDto fullObjectKeyDto) {
        if (AuthUtility.getUserIdFromToken(token) == null) return "Invalid token";
        String objectKey = fullObjectKeyDto.getFullObjectKey();

        try {
            AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                    .withRegion(Regions.US_EAST_1)
                    .build();
            s3Client.deleteObject(new DeleteObjectRequest("cinemunitybucket", objectKey));
            return "File deleted successfully";
        } catch (AmazonServiceException e) {
            // Handle AmazonServiceException
            return "Failed to delete the file: " + e.getMessage();
        } catch (SdkClientException e) {
            // Handle SdkClientException
            return "Failed to delete the file: " + e.getMessage();
        }
    }
}
