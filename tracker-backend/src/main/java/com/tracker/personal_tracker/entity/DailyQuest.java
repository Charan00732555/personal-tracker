package com.tracker.personal_tracker.entity;

import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import com.tracker.personal_tracker.entity.User;

@Entity
@Table(name = "daily_quests")
@Data
public class DailyQuest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private int xpReward;
    
    // Type of quest: "DSA", "WORKOUT", "JOURNAL"
    private String type;
    
    // Status: "ACTIVE", "COMPLETED", "FAILED"
    private String status;
    
    private LocalDate assignedDate;
    private LocalDate completedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;
}
