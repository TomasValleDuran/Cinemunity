package org.example.model;

import com.google.gson.*;

import javax.persistence.*;
import java.lang.reflect.Type;

@SuppressWarnings("ALL")
@Entity
public class Reply {
    @Id
    @GeneratedValue(generator = "userGen", strategy = GenerationType.SEQUENCE)
    private Long replyId;

    @Column(length = 2000)
    private String reply_text;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ReviewId")
    private Review review;

    public Reply() {}

    public Reply(User user, Review review, String reply_text) {
        this.user = user;
        this.review = review;
        this.reply_text = reply_text;
    }

    public Long getReplyId() {
        return replyId;
    }

    public String getUserName() {
        return user.getUsername();
    }

    public User getUser() {
        return user;
    }

    public String asJson() {
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Reply.class, new JsonSerializer<Reply>() {
                    @Override
                    public JsonElement serialize(Reply reply, Type typeOfScr, JsonSerializationContext context) {
                        JsonObject jsonObject = new JsonObject();
                        jsonObject.addProperty("replyId", reply.getReplyId());
                        jsonObject.addProperty("reply_text", reply.reply_text);
                        jsonObject.addProperty("username", reply.getUser().getUsername());
                        jsonObject.addProperty("userId", reply.getUser().getUserId());
                        return jsonObject;
                    }
                })
                .create();
        return gson.toJson(this);
    }
}
