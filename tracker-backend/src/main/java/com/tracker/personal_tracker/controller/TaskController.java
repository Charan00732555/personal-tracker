package com.tracker.personal_tracker.controller;

import com.tracker.personal_tracker.dto.TaskDto;
import com.tracker.personal_tracker.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskDto>> getTasks() {
        return ResponseEntity.ok(taskService.getTasks());
    }

    @PostMapping
    public ResponseEntity<TaskDto> createTask(@RequestBody TaskDto dto) {
        return ResponseEntity.ok(taskService.createTask(dto));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<TaskDto> completeTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.completeTask(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }
}
