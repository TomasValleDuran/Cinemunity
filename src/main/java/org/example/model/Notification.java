package org.example.model;

import com.google.gson.*;

import javax.persistence.*;
import java.lang.reflect.Type;

@Entity
public class Notification {
    @Id
    @GeneratedValue(generator = "userGen", strategy = GenerationType.SEQUENCE)
    private Long notificationId;

    @Column
    private String message;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @Column
    private boolean isRead;

    @Column
    private Long taggerId;

    @Column
    private Long showId;

    @Column
    private Long reviewId;

    public Notification() {}

    public Notification(User user, String message, Long taggerId, Long showId, Long reviewId) {
        this.user = user;
        this.message = message;
        this.isRead = false;
        this.taggerId = taggerId;
        this.showId = showId;
        this.reviewId = reviewId;
    }

    public Long getNotificationId() {
        return notificationId;
    }

    public String getMessage() {
        return message;
    }

    public User getUser() {
        return user;
    }

    public boolean getIsRead() {
        return isRead;
    }

    public Long getTaggerId() {
        return taggerId;
    }

    public Long getShowId() {
        return showId;
    }

    public Long getReviewId() {
        return reviewId;
    }

    public String asJson() {
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Notification.class, new JsonSerializer<Notification>() {
                    @Override
                    public JsonElement serialize(Notification notification, Type type, JsonSerializationContext jsonSerializationContext) {
                        JsonObject jsonObject = new JsonObject();
                        jsonObject.addProperty("notificationId", notification.getNotificationId());
                        jsonObject.addProperty("message", notification.getMessage());
                        jsonObject.addProperty("isRead", notification.getIsRead());
                        jsonObject.addProperty("taggerId", notification.getTaggerId());
                        jsonObject.addProperty("showId", notification.getShowId());
                        jsonObject.addProperty("reviewId", notification.getReviewId());
                        jsonObject.addProperty("username", notification.getUser().getUsername());
                        jsonObject.addProperty("userId", notification.getUser().getUserId());
                        return jsonObject;
                    }
                })
                .create();
        return gson.toJson(this);
    }

    public void read() {
        this.isRead = true;
    }

    public void unread() {
        this.isRead = false;
    }
}
