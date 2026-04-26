package com.tracker.personal_tracker.controller;

import com.tracker.personal_tracker.entity.Workout;
import com.tracker.personal_tracker.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Tells Spring this class handles JSON requests
@RequestMapping("/api/workouts") // The base URL for all workout actions
@RequiredArgsConstructor // Constructor injection for our service
@CrossOrigin(origins = "http://localhost:5173") // Allows your React app to talk to this API
public class WorkoutController {

    private final WorkoutService workoutService;

    // CREATE: Add a new workout
    @PostMapping
    public ResponseEntity<Workout> addWorkout(@RequestBody Workout workout) {
        // @RequestBody converts the JSON from React into a Java Workout object
        return ResponseEntity.ok(workoutService.createWorkout(workout));
    }

    // READ: Get all workouts
    @GetMapping
    public List<Workout> getAllWorkouts() {
        return workoutService.getAllWorkouts();
    }

    // READ: Get a single workout by ID
    @GetMapping("/{id}")
    public ResponseEntity<Workout> getWorkoutById(@PathVariable Long id) {
        return ResponseEntity.ok(workoutService.getWorkoutById(id));
    }

    // DELETE: Remove a workout
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.ok("Workout deleted successfully");
    }
}