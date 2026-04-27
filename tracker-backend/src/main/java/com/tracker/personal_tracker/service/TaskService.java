package com.tracker.personal_tracker.service;

import com.tracker.personal_tracker.dto.TaskDto;
import com.tracker.personal_tracker.entity.Task;
import com.tracker.personal_tracker.entity.User;
import com.tracker.personal_tracker.repository.TaskRepository;
import com.tracker.personal_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final SystemGamificationService gamificationService;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    public List<TaskDto> getTasks() {
        User user = getCurrentUser();
        return taskRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public TaskDto createTask(TaskDto dto) {
        User user = getCurrentUser();
        Task task = new Task();
        task.setUser(user);
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setCompleted(false);
        task = taskRepository.save(task);
        return mapToDto(task);
    }

    @Transactional
    public TaskDto completeTask(Long taskId) {
        User user = getCurrentUser();
        Task task = taskRepository.findById(taskId).orElseThrow();
        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        if (!task.isCompleted()) {
            task.setCompleted(true);
            task.setCompletedAt(LocalDateTime.now());
            // Award Agility XP! +10 XP per task.
            gamificationService.awardBonusXp(user, "TASK", 10);
            task = taskRepository.save(task);
        }
        return mapToDto(task);
    }

    public void deleteTask(Long taskId) {
        User user = getCurrentUser();
        Task task = taskRepository.findById(taskId).orElseThrow();
        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        taskRepository.delete(task);
    }

    private TaskDto mapToDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setCompleted(task.isCompleted());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setCompletedAt(task.getCompletedAt());
        return dto;
    }
}
