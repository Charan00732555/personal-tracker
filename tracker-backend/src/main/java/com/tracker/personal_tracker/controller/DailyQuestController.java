package com.tracker.personal_tracker.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tracker.personal_tracker.entity.DailyQuest;
import com.tracker.personal_tracker.service.DailyQuestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/quests")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DailyQuestController {

    private final DailyQuestService dailyQuestService;

    @GetMapping("/daily")
    public ResponseEntity<List<DailyQuest>> getTodayQuests() {
        return ResponseEntity.ok(dailyQuestService.getTodayQuests());
    }
}
