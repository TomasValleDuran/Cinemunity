package org.example.dto;

public class RecoverPasswordDto {
    private String email;

    public RecoverPasswordDto(String email){
        this.email = email;
    }

    public String getEmail(){
        return email;
    }
}
