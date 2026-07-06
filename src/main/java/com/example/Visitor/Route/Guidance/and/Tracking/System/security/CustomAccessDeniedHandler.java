package com.example.Visitor.Route.Guidance.and.Tracking.System.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException)
            throws IOException, ServletException {
        
        String path = "C:/Users/alagu/.gemini/antigravity-ide/brain/5aca17c2-f48d-4347-99d5-7b39c9725b79/scratch/access_denied_logs.txt";
        try (FileWriter fw = new FileWriter(path, true);
             PrintWriter pw = new PrintWriter(fw)) {
            pw.println("--- ACCESS DENIED AT: " + LocalDateTime.now() + " ---");
            pw.println("Request URI: " + request.getRequestURI());
            pw.println("Method: " + request.getMethod());
            pw.println("Auth Header: " + request.getHeader("Authorization"));
            pw.println("Current User Principal: " + SecurityContextHolder.getContext().getAuthentication());
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                pw.println("Authorities: " + SecurityContextHolder.getContext().getAuthentication().getAuthorities());
            }
            pw.println("Exception message: " + accessDeniedException.getMessage());
            pw.println();
        } catch (Exception e) {
            e.printStackTrace();
        }

        response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied");
    }
}
