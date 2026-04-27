package com.tracker.personal_tracker.service;

import com.tracker.personal_tracker.dto.PlayerStatsDTO;
import com.tracker.personal_tracker.entity.*;
import com.tracker.personal_tracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SystemGamificationService {

    private final PlayerStatsRepository playerStatsRepository;
    private final WorkoutRepository workoutRepository;
    private final DsaRepository dsaRepository;
    private final JournalRepository journalRepository;
    private final UserRepository userRepository;

    private static final int XP_PER_LEVEL = 100;

    // ─── Helper: get current authenticated user ───────────────────────────────
    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    // ─── Helper: get or create PlayerStats for current user ──────────────────
    public PlayerStats getPlayerStats(User user) {
        System.out.println("Fetching PlayerStats for user: " + user.getUsername());
        System.out.println("User :- " + user);
        return playerStatsRepository.findByUser(user).orElseGet(() -> {
            PlayerStats newStats = new PlayerStats();
            newStats.setUser(user);
            return playerStatsRepository.save(newStats);
        });
    }

    public PlayerStatsDTO getPlayerStatsDTO() {
        User user = getCurrentUser();
        PlayerStats stats = getPlayerStats(user);
        return buildDTO(stats);
    }

    private PlayerStatsDTO buildDTO(PlayerStats stats) {
        PlayerStatsDTO dto = new PlayerStatsDTO();
        dto.setStrengthLevel((stats.getStrengthXp() / XP_PER_LEVEL) + 1);
        dto.setIntelligenceLevel((stats.getIntelligenceXp() / XP_PER_LEVEL) + 1);
        dto.setWisdomLevel((stats.getWisdomXp() / XP_PER_LEVEL) + 1);
        dto.setAgilityLevel((stats.getAgilityXp() / XP_PER_LEVEL) + 1);
        dto.setStrengthXp(stats.getStrengthXp());
        dto.setIntelligenceXp(stats.getIntelligenceXp());
        dto.setWisdomXp(stats.getWisdomXp());
        dto.setAgilityXp(stats.getAgilityXp());
        dto.setStrengthXpRemaining(stats.getStrengthXp() % XP_PER_LEVEL);
        dto.setIntelligenceXpRemaining(stats.getIntelligenceXp() % XP_PER_LEVEL);
        dto.setWisdomXpRemaining(stats.getWisdomXp() % XP_PER_LEVEL);
        dto.setAgilityXpRemaining(stats.getAgilityXp() % XP_PER_LEVEL);
        dto.setWorkoutStreak(stats.getWorkoutStreak());
        dto.setJournalStreak(stats.getJournalStreak());
        return dto;
    }

    @Transactional
    public void awardWorkoutXp(User user, LocalDate workoutDate) {
        if (workoutDate == null)
            return;
        PlayerStats stats = getPlayerStats(user);

        if (stats.getLastWorkoutDate() == null) {
            stats.setStrengthXp(stats.getStrengthXp() + 10);
            stats.setWorkoutStreak(1);
            stats.setLastWorkoutDate(workoutDate);
        } else if (!stats.getLastWorkoutDate().isEqual(workoutDate)) {
            if (stats.getLastWorkoutDate().plusDays(1).isEqual(workoutDate)) {
                stats.setWorkoutStreak(stats.getWorkoutStreak() + 1);
            } else if (workoutDate.isAfter(stats.getLastWorkoutDate())) {
                stats.setWorkoutStreak(1);
            }
            stats.setStrengthXp(stats.getStrengthXp() + 10);
            if (stats.getWorkoutStreak() > 0 && stats.getWorkoutStreak() % 3 == 0) {
                stats.setStrengthXp(stats.getStrengthXp() + 15);
            }
            if (workoutDate.isAfter(stats.getLastWorkoutDate())) {
                stats.setLastWorkoutDate(workoutDate);
            }
        }
        playerStatsRepository.save(stats);
    }

    @Transactional
    public void awardDsaXp(User user, String difficulty) {
        PlayerStats stats = getPlayerStats(user);
        int xp = 10;
        if ("Medium".equalsIgnoreCase(difficulty))
            xp = 20;
        if ("Hard".equalsIgnoreCase(difficulty))
            xp = 30;
        stats.setIntelligenceXp(stats.getIntelligenceXp() + xp);
        playerStatsRepository.save(stats);
    }

    @Transactional
    public void awardJournalXp(User user, LocalDate journalDate) {
        if (journalDate == null)
            return;
        PlayerStats stats = getPlayerStats(user);

        if (stats.getLastJournalDate() == null) {
            stats.setWisdomXp(stats.getWisdomXp() + 10);
            stats.setJournalStreak(1);
            stats.setLastJournalDate(journalDate);
        } else if (!stats.getLastJournalDate().isEqual(journalDate)) {
            if (stats.getLastJournalDate().plusDays(1).isEqual(journalDate)) {
                stats.setJournalStreak(stats.getJournalStreak() + 1);
            } else if (journalDate.isAfter(stats.getLastJournalDate())) {
                stats.setJournalStreak(1);
            }
            stats.setWisdomXp(stats.getWisdomXp() + 10);
            if (stats.getJournalStreak() > 0 && stats.getJournalStreak() % 3 == 0) {
                stats.setWisdomXp(stats.getWisdomXp() + 15);
            }
            if (journalDate.isAfter(stats.getLastJournalDate())) {
                stats.setLastJournalDate(journalDate);
            }
        }
        playerStatsRepository.save(stats);
    }

    @Transactional
    public void awardBonusXp(User user, String type, int xp) {
        PlayerStats stats = getPlayerStats(user);
        if ("WORKOUT".equalsIgnoreCase(type))
            stats.setStrengthXp(stats.getStrengthXp() + xp);
        else if ("DSA".equalsIgnoreCase(type))
            stats.setIntelligenceXp(stats.getIntelligenceXp() + xp);
        else if ("JOURNAL".equalsIgnoreCase(type))
            stats.setWisdomXp(stats.getWisdomXp() + xp);
        else if ("TASK".equalsIgnoreCase(type))
            stats.setAgilityXp(stats.getAgilityXp() + xp);
        playerStatsRepository.save(stats);
    }

    @Transactional
    public void calculateRetroactiveXp() {
        User user = getCurrentUser();
        PlayerStats stats = getPlayerStats(user);
        stats.setStrengthXp(0);
        stats.setIntelligenceXp(0);
        stats.setWisdomXp(0);
        stats.setAgilityXp(0);
        stats.setLastWorkoutDate(null);
        stats.setWorkoutStreak(0);
        stats.setLastJournalDate(null);
        stats.setJournalStreak(0);
        playerStatsRepository.save(stats);

        List<Workout> workouts = workoutRepository.findByUserOrderByDateAsc(user);
        for (Workout w : workouts)
            awardWorkoutXp(user, w.getDate());

        List<DsaProblem> dsas = dsaRepository.findAll();
        for (DsaProblem d : dsas) {
            if ("Solved".equalsIgnoreCase(d.getStatus()))
                awardDsaXp(user, d.getDifficulty());
        }

        List<JournalEntry> journals = journalRepository.findByUserOrderByDateAsc(user);
        for (JournalEntry j : journals)
            awardJournalXp(user, j.getDate());
    }
}
