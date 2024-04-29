package org.example.dto;

public class ModifyPasswordDto {
    private String currentPassword;
    private String newPassword;

    public ModifyPasswordDto() {
    }

    public ModifyPasswordDto(String currentPassword, String newPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }
}
