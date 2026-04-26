package com.tracker.personal_tracker.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import com.tracker.personal_tracker.entity.User;

@Entity
@Table(name = "player_stats")
@Data
public class PlayerStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Each user has their own PlayerStats row
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    private int strengthXp = 0;
    private int intelligenceXp = 0;
    private int wisdomXp = 0;

    private LocalDate lastWorkoutDate;
    private int workoutStreak = 0;

    private LocalDate lastJournalDate;
    private int journalStreak = 0;
}
