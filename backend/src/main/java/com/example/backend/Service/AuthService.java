package com.example.backend.Service;

import org.springframework.stereotype.Service;

import com.example.backend.DTO.LoginRequest;
import com.example.backend.DTO.LoginResponse;
import com.example.backend.Entity.User;
import com.example.backend.Repository.UserRepository;
import com.example.backend.Security.JwtService;

@Service 
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    
    public LoginResponse login(LoginRequest request){
        User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(()->new RuntimeException("Email not found")   );
        
        if(!user.getPassword().equals(request.getPassword())){
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(
            token,
            user.getid(),
            user.getEmail(),
            user.getRole(),
            user.getFull_name()
        );
    }
    
}
