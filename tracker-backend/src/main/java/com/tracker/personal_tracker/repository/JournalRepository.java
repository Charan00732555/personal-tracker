package com.tracker.personal_tracker.repository;

import com.tracker.personal_tracker.entity.JournalEntry;
import com.tracker.personal_tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface JournalRepository extends JpaRepository<JournalEntry, Long> {
    Optional<JournalEntry> findByDateAndUser(LocalDate date, User user);
    List<JournalEntry> findByUser(User user);
    List<JournalEntry> findByUserOrderByDateAsc(User user);
}