package com.example.backend.Security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import io.jsonwebtoken.Claims;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        System.out.println(">>> JwtFilter - URI: " + request.getRequestURI() + " Method: " + request.getMethod());
        System.out.println(">>> JwtFilter - Auth Header: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println(">>> JwtFilter - No Bearer token found, skipping...");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            Claims claims = jwtService.extractAllClaims(jwt);
            
            String userId = claims.getSubject();
            String role = claims.get("role", String.class);
            if (role != null) {
                role = role.toUpperCase();
            }
            System.out.println(">>> JwtFilter - userId: " + userId + ", role: " + role);
            System.out.println(">>> JwtFilter - Setting authority: ROLE_" + role);

            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userId, 
                        null, 
                        Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role))
                );
                
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println(">>> JwtFilter - Authentication set successfully");
            }
        } catch (Exception e) {
            System.out.println(">>> JwtFilter - Invalid JWT Token: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
