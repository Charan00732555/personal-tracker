package com.tracker.personal_tracker.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "dsa_problems")
@Data
public class DsaProblem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String problemName;
    private String topic;        // e.g., "Array", "Graph"
    private String patternType;  // e.g., "Two Pointer", "BFS"
    private String link;
    private String difficulty;   // "Easy", "Medium", "Hard"
    
    private String status;       // "Solved", "Pending", "Unsolved"
    private LocalDate solvedDate;
    private LocalDate revisionDate;

    // Logic Flag: True for system-provided, False for user-added
    @Column(nullable = false)
    private boolean isPredefined = false;
}
