package com.tracker.personal_tracker.repository;

import com.tracker.personal_tracker.entity.Task;
import com.tracker.personal_tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserOrderByCreatedAtDesc(User user);
}
