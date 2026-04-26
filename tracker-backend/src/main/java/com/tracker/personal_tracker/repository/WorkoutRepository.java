package com.tracker.personal_tracker.repository;

import com.tracker.personal_tracker.entity.Workout;
import com.tracker.personal_tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByUser(User user);
    List<Workout> findByUserOrderByDateAsc(User user);
}
