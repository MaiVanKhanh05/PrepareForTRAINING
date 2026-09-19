package com.example.backend.DTO.Authentication;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SignupRequest {
    @NotBlank
    @Size(min = 4,max=8) 
    private String id;
    @NotBlank
    @Size(min = 2,max=50) 
    private String full_name;
    @NotBlank 
    @Email(message = "Invalid email")
    private String email;
    @NotBlank 
    @Size(min = 2,max=50) 
    private String password;
    @NotBlank 
    @Pattern(regexp = "^(USER|OWNER|ADMIN)$")
    private String role;

    public SignupRequest() {
    }

    public SignupRequest(String email, String full_name, String id, String password, String role) {
        this.email = email;
        this.full_name = full_name;
        this.id = id;
        this.password = password;
        this.role = role;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFull_name() {
        return full_name;
    }

    public void setFull_name(String full_name) {
        this.full_name = full_name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    
    
}

