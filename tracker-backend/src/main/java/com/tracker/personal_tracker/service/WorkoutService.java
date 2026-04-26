package com.tracker.personal_tracker.service;

import com.tracker.personal_tracker.entity.User;
import com.tracker.personal_tracker.entity.Workout;
import com.tracker.personal_tracker.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final SystemGamificationService gamificationService;
    private final DailyQuestService dailyQuestService;

    public Workout createWorkout(Workout workout) {
        User user = gamificationService.getCurrentUser();
        workout.setUser(user);
        Workout saved = workoutRepository.save(workout);
        gamificationService.awardWorkoutXp(user, saved.getDate());
        dailyQuestService.checkAndCompleteQuest(user, "WORKOUT");
        return saved;
    }

    public List<Workout> getAllWorkouts() {
        User user = gamificationService.getCurrentUser();
        return workoutRepository.findByUser(user);
    }

    public Workout getWorkoutById(Long id) {
        return workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found with id: " + id));
    }

    public void deleteWorkout(Long id) {
        workoutRepository.deleteById(id);
    }
}