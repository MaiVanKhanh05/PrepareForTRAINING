package com.example.backend.Repository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.Entity.User;


public interface UserRepository extends JpaRepository<User, String> {
    
Optional<User> findByEmail(String email);
Optional<User> findById(String id);
Page<User> findByEmailContainingIgnoreCase(String email, Pageable pageable);
List<User> findAll();
void deleteById(String id);


}