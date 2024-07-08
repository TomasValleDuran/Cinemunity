package org.example.dto;

public class AddNotificationDto {
    private String message;
    private String username;
    private String taggerId;
    private String showId;

    public AddNotificationDto() {}

    public AddNotificationDto(String message, String username, String  taggerId, String showId) {
        this.message = message;
        this.username = username;
        this.taggerId = taggerId;
        this.showId = showId;
    }

    public String getMessage() {
        return message;
    }

    public String getUsername() {
        return username;
    }

    public Long getTaggerId() {
        return Long.parseLong(taggerId);
    }

    public Long getShowId() {
        return Long.parseLong(showId);
    }
}
