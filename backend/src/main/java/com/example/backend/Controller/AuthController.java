package com.example.backend.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.DTO.Authentication.LoginRequest;
import com.example.backend.DTO.Authentication.LoginResponse;
import com.example.backend.DTO.Authentication.SignupRequest;
import com.example.backend.Service.AuthService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController //Class này chứa các API endpoint và kết quả trả về sẽ được chuyển thành JSON.
@RequestMapping ("/api/auth")//đặt prefix URL cho tất cả API trong class.

public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request){
        //@RequestBody lấy JSON từ request chuyển thành object LoginRequest.
        return authService.login(request);
    }

    @PostMapping("/signup")
    public LoginResponse signup(@Valid @RequestBody SignupRequest request){
        return authService.signup(request);
    }

}
