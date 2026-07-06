package com.example.Visitor.Route.Guidance.and.Tracking.System.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

        private final String SECRET = "mysecretkeymysecretkeymysecretkey123456";

        private final long EXPIRATION = 86400000;

        private Key getKey() {
                return Keys.hmacShaKeyFor(
                                SECRET.getBytes());
        }

        public String generateToken(
                        String email) {

                return Jwts.builder()
                                .subject(email)
                                .issuedAt(new Date())
                                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                                .signWith(getKey())
                                .compact();
        }

        public String generateToken(String email, String role) {
                return Jwts.builder()
                                .subject(email)
                                .claim("role", role)
                                .issuedAt(new Date())
                                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                                .signWith(getKey())
                                .compact();
        }

        public Claims extractAllClaims(String token) {
                return Jwts.parser()
                                .verifyWith((javax.crypto.SecretKey) getKey())
                                .build()
                                .parseSignedClaims(token)
                                .getPayload();
        }

        public String extractUsername(String token) {
                return extractAllClaims(token).getSubject();
        }

        public String extractRole(String token) {
                return extractAllClaims(token).get("role", String.class);
        }

        public boolean isTokenExpired(String token) {
                return extractAllClaims(token).getExpiration().before(new Date());
        }

        public boolean validateToken(String token, String email) {
                return (email.equals(extractUsername(token)) && !isTokenExpired(token));
        }

}