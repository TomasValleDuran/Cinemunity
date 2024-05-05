package org.example.dto;

public class FollowDto {
    public String userId;

    public FollowDto(String userId) {
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }
}
