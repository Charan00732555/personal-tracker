package com.tracker.personal_tracker.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tracker.personal_tracker.entity.JournalEntry;
import com.tracker.personal_tracker.service.JournalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class JournalController {
    private final JournalService journalService;

    @GetMapping
    public ResponseEntity<List<JournalEntry>> getAllEntries() {
        return ResponseEntity.ok(journalService.getAllEntries());
    }

    @PostMapping
    public ResponseEntity<JournalEntry> submitEntry(@RequestBody JournalEntry entry) {
        return ResponseEntity.ok(journalService.saveOrUpdateEntry(entry));
    }
}
