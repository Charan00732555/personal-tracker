package com.tracker.personal_tracker.repository;

import com.tracker.personal_tracker.entity.PlayerStats;
import com.tracker.personal_tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PlayerStatsRepository extends JpaRepository<PlayerStats, Long> {
    Optional<PlayerStats> findByUser(User user);
}
