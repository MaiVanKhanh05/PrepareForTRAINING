package com.example.backend.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestBody;
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
    public Page<User> getAllUsers(
        @RequestParam(required = false) String email,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return userService.getAllUsers(email, page, size);
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

    @org.springframework.web.bind.annotation.PutMapping("/{id}/role")
    public String updateUserRole(@PathVariable String id, @RequestBody java.util.Map<String, String> body) {
        String newRole = body.get("role");
        if (newRole != null) {
            userService.updateUserRole(id, newRole);
            return "User role updated successfully";
        }
        throw new RuntimeException("Role is missing");
    }
}