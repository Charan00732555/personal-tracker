package com.tracker.personal_tracker.dto;

import lombok.Data;

@Data
public class PlayerStatsDTO {
    private int strengthLevel;
    private int intelligenceLevel;
    private int wisdomLevel;
    
    // Total accumulated XP
    private int strengthXp;
    private int intelligenceXp;
    private int wisdomXp;

    // Remaining XP in current level
    private int strengthXpRemaining; 
    private int intelligenceXpRemaining;
    private int wisdomXpRemaining;

    private int workoutStreak;
    private int journalStreak;
}
