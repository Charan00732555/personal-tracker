package com.tracker.personal_tracker.controller;

import com.tracker.personal_tracker.entity.DsaProblem;
import com.tracker.personal_tracker.service.DsaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dsa")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DsaController {

    private final DsaService dsaService;

    @GetMapping
    public List<DsaProblem> getAll() {
        return dsaService.getAllProblems();
    }

    @PostMapping
    public ResponseEntity<DsaProblem> create(@RequestBody DsaProblem problem) {
        return ResponseEntity.status(201).body(dsaService.saveProblem(problem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DsaProblem> update(@PathVariable Long id, @RequestBody DsaProblem details) {
        return ResponseEntity.ok(dsaService.updateProblem(id, details));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dsaService.deleteProblem(id);
        return ResponseEntity.noContent().build(); 
        // 204 No Content is the standard response for successful deletion
    }
    
}