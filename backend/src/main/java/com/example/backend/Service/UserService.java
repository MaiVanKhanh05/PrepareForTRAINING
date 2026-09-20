package com.example.backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.Entity.User;
import com.example.backend.Repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUserById(String id) {
        userRepository.deleteById(id);
    }
}
