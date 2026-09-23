package com.example.backend.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Entity.User;
import com.example.backend.Service.UserService;

import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping()
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUserById(@PathVariable String id) {//@PathVariable lấy giá trị từ url
        userService.deleteUserById(id);
        return "User deleted successfully";
    }
    
    @GetMapping("/check-email")
    public boolean checkEmailExists(@RequestParam String email) {
        return userService.checkEmailExists(email);
    }
}