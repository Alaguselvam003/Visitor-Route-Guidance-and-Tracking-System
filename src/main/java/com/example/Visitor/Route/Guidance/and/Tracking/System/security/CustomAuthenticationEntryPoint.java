package com.example.Visitor.Route.Guidance.and.Tracking.System.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        
        String path = "C:/Users/alagu/.gemini/antigravity-ide/brain/5aca17c2-f48d-4347-99d5-7b39c9725b79/scratch/unauthorized_logs.txt";
        try (FileWriter fw = new FileWriter(path, true);
             PrintWriter pw = new PrintWriter(fw)) {
            pw.println("--- UNAUTHORIZED ACCESS AT: " + LocalDateTime.now() + " ---");
            pw.println("Request URI: " + request.getRequestURI());
            pw.println("Method: " + request.getMethod());
            pw.println("Auth Header: " + request.getHeader("Authorization"));
            pw.println("Exception message: " + authException.getMessage());
            pw.println();
        } catch (Exception e) {
            e.printStackTrace();
        }

        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    }
}
