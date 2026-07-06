package com.example.Visitor.Route.Guidance.and.Tracking.System.entity;

import jakarta.persistence.*;

@Entity
@Table(name="routes")

public class Route {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String source;

    private String destination;

    private String instructions;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id=id;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source=source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination=destination;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions=instructions;
    }

}
