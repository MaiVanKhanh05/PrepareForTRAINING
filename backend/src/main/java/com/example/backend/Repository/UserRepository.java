package com.example.backend.Repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.Entity.User;


public interface UserRepository extends JpaRepository<User, String> {
Optional<User> findByEmail(String email);
Optional<User> findById(String id);

}