package org.example.dto;

public class ModifyAccountDto {
    private String email;
    private String username;
    private String password;
    private String imageUrl;

    public ModifyAccountDto() {
    }

    public ModifyAccountDto(String email, String username, String password, String imageUrl) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.imageUrl = imageUrl;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
    public String getImageUrl() {
        return imageUrl;
    }
}
