package com.linkforge.dto.link;

import jakarta.validation.constraints.NotBlank;

public class PasswordVerifyRequest {

    @NotBlank(message = "Password cannot be blank")
    private String password;

    public PasswordVerifyRequest() {
    }

    public PasswordVerifyRequest(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
