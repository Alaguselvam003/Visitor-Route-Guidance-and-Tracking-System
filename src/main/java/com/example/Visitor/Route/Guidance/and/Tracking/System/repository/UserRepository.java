package com.example.Visitor.Route.Guidance.and.Tracking.System.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.User;


public interface UserRepository 
extends JpaRepository<User,Long>{
    Optional<User> findByEmail(String email);
     
    
} 

    

