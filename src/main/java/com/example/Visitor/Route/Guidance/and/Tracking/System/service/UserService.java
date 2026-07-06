package com.example.Visitor.Route.Guidance.and.Tracking.System.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.User;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public String login(
            String email,
            String password
    ) {

        Optional<User> optionalUser =
                userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {

            User user = optionalUser.get();

            if (user.getPassword().equals(password)) {
                return "Login Successful";
            }
        }

        return "Invalid User";
    }
}