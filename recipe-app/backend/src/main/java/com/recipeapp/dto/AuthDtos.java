package com.recipeapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {

    public static class SignupRequest {
        @NotBlank @Email
        public String email;

        @NotBlank
        public String name;

        @NotBlank @Size(min = 6, message = "must be at least 6 characters")
        public String password;
    }

    public static class LoginRequest {
        @NotBlank @Email
        public String email;

        @NotBlank
        public String password;
    }

    public static class AuthResponse {
        public String token;
        public String email;
        public String name;

        public AuthResponse(String token, String email, String name) {
            this.token = token;
            this.email = email;
            this.name = name;
        }
    }
}
