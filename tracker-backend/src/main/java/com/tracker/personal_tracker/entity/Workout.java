package com.tracker.personal_tracker.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import com.tracker.personal_tracker.entity.User;

@Entity
@Table(name = "workouts")
@Data
public class Workout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String workoutName; // "Upper Body"
    private String type; //"Push, Pull, Legs, Arms"
    private int totalSets;

    // We use ElementCollection to store a list of values for each set
    // This allows you to enter: Set 1: 10 reps, Set 2: 8 reps, etc.
    @ElementCollection
    private List<Integer> repsPerSet; 

    @ElementCollection
    private List<Double> weightsPerSet; // Use Double so you can have 12.5 kg

    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    // System Design Tip: Default to the current date if not provided
    @PrePersist
    protected void onCreate() {
        if (this.date == null) {
            this.date = LocalDate.now();
        }
    }
}
