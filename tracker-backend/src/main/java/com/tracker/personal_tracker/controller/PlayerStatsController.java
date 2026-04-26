package com.tracker.personal_tracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.tracker.personal_tracker.dto.PlayerStatsDTO;
import com.tracker.personal_tracker.service.SystemGamificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PlayerStatsController {

    private final SystemGamificationService gamificationService;

    @GetMapping
    public ResponseEntity<PlayerStatsDTO> getPlayerStats() {
        return ResponseEntity.ok(gamificationService.getPlayerStatsDTO());
    }

    @PostMapping("/retroactive")
    public ResponseEntity<String> calculateRetroactiveXp() {
        gamificationService.calculateRetroactiveXp();
        return ResponseEntity.ok("Retroactive XP correctly calculated from historical data.");
    }
}
