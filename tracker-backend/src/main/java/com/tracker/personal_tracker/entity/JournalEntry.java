package com.tracker.personal_tracker.entity;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.Data;
import com.tracker.personal_tracker.entity.User;

@Entity
@Table(name = "journal_entries")
@Data
public class JournalEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private LocalDate date;

    @Column(columnDefinition = "TEXT")
    private String reflection;

    @Column(columnDefinition = "TEXT")
    private String alignment;

    @Column(columnDefinition = "TEXT")
    private String energy;

    @Column(columnDefinition = "TEXT")
    private String avoidance;

    @Column(columnDefinition = "TEXT")
    private String needs;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @PrePersist
    protected void onCreate() {
        if (this.date == null) {
            this.date = LocalDate.now();
        }
    }
}
