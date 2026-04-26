package com.tracker.personal_tracker.repository;

import com.tracker.personal_tracker.entity.DailyQuest;
import com.tracker.personal_tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyQuestRepository extends JpaRepository<DailyQuest, Long> {
    List<DailyQuest> findByUserAndAssignedDate(User user, LocalDate assignedDate);
    List<DailyQuest> findByUserAndAssignedDateAndStatus(User user, LocalDate assignedDate, String status);
    List<DailyQuest> findByAssignedDateAndStatus(LocalDate assignedDate, String status); // for cron job (all users)
}
