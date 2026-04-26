package com.tracker.personal_tracker.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.tracker.personal_tracker.entity.JournalEntry;
import com.tracker.personal_tracker.entity.User;
import com.tracker.personal_tracker.repository.JournalRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JournalService {

    private final JournalRepository journalRepository;
    private final SystemGamificationService gamificationService;
    private final DailyQuestService dailyQuestService;

    public List<JournalEntry> getAllEntries() {
        User user = gamificationService.getCurrentUser();
        return journalRepository.findByUser(user);
    }

    public JournalEntry saveOrUpdateEntry(JournalEntry entry) {
        User user = gamificationService.getCurrentUser();
        LocalDate entryDate = (entry.getDate() != null) ? entry.getDate() : LocalDate.now();

        JournalEntry saved = journalRepository.findByDateAndUser(entryDate, user)
            .map(existing -> {
                existing.setReflection(entry.getReflection());
                existing.setAlignment(entry.getAlignment());
                existing.setEnergy(entry.getEnergy());
                existing.setAvoidance(entry.getAvoidance());
                existing.setNeeds(entry.getNeeds());
                return journalRepository.save(existing);
            })
            .orElseGet(() -> {
                entry.setDate(entryDate);
                entry.setUser(user);
                JournalEntry newEntry = journalRepository.save(entry);
                gamificationService.awardJournalXp(user, newEntry.getDate());
                dailyQuestService.checkAndCompleteQuest(user, "JOURNAL");
                return newEntry;
            });

        return saved;
    }
}
