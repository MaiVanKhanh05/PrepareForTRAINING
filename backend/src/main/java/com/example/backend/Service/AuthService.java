package com.example.backend.Service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.DTO.Authentication.LoginRequest;
import com.example.backend.DTO.Authentication.LoginResponse;
import com.example.backend.DTO.Authentication.SignupRequest;
import com.example.backend.Entity.User;
import com.example.backend.Exception.AppException;
import com.example.backend.Repository.UserRepository;
import com.example.backend.Security.JwtService;

@Service 
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }
    
    public LoginResponse login(LoginRequest request){
        User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(()->new AppException(HttpStatus.NOT_FOUND, "Email not found")   );
        
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new AppException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(
            token,
            user.getId(),
            user.getEmail(),
            user.getRole(),
            user.getFull_name()
        );
    }

   public LoginResponse signup(SignupRequest signupRequest){

     if(userRepository.findByEmail(signupRequest.getEmail()).isPresent()){
            throw new AppException(HttpStatus.CONFLICT,
                    "Email đã tồn tại");
    }

    if(userRepository.findById(signupRequest.getId()).isPresent()){
            throw new AppException(HttpStatus.CONFLICT,
                    "Id đã tồn tại");
    }

        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setFull_name(signupRequest.getFull_name());
        user.setRole(signupRequest.getRole());
        user.setId(signupRequest.getId());

        userRepository.save(user);

        String token = jwtService.generateToken(user);

        return new LoginResponse(
            token,
            user.getId(),
            user.getEmail(),
            user.getRole(),
            user.getFull_name()
        );
    }
    
}
