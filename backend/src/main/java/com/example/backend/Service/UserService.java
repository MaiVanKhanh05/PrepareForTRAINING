package com.example.backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import com.example.backend.Repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Page<User> getAllUsers(String email, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        if (email != null && !email.trim().isEmpty()) {
            return userRepository.findByEmailContainingIgnoreCase(email, pageRequest);
        }
        return userRepository.findAll(pageRequest);
    }

    public void deleteUserById(String id) {
        userRepository.deleteById(id);
    }

    public boolean checkEmailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public void updateUserRole(String userId, String newRole) {
        java.util.Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setRole(newRole);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }
}
