package com.tracker.personal_tracker.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tracker.personal_tracker.entity.DailyQuest;
import com.tracker.personal_tracker.entity.User;
import com.tracker.personal_tracker.repository.DailyQuestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DailyQuestService {

    private final DailyQuestRepository dailyQuestRepository;
    private final SystemGamificationService gamificationService;

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void resetDailyQuests() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        // Fail all users' incomplete quests from yesterday
        List<DailyQuest> yesterdaysActive = dailyQuestRepository.findByAssignedDateAndStatus(yesterday, "ACTIVE");
        for (DailyQuest q : yesterdaysActive) {
            q.setStatus("FAILED");
            dailyQuestRepository.save(q);
        }
        // Note: new quests are generated on-demand (lazy) when user opens the dashboard
    }

    @Transactional
    public List<DailyQuest> getTodayQuests() {
        User user = gamificationService.getCurrentUser();
        return getTodayQuestsForUser(user);
    }

    public List<DailyQuest> getTodayQuestsForUser(User user) {
        LocalDate today = LocalDate.now();
        List<DailyQuest> quests = dailyQuestRepository.findByUserAndAssignedDate(user, today);
        if (quests.isEmpty()) {
            generateQuestsForUser(user, today);
            quests = dailyQuestRepository.findByUserAndAssignedDate(user, today);
        }
        return quests;
    }

    private void generateQuestsForUser(User user, LocalDate date) {
        DailyQuest dsa = new DailyQuest();
        dsa.setTitle("Algorithmic Grind");
        dsa.setDescription("Solve 1 DSA Problem via Tracker.");
        dsa.setXpReward(100);
        dsa.setType("DSA");
        dsa.setStatus("ACTIVE");
        dsa.setAssignedDate(date);
        dsa.setUser(user);
        dailyQuestRepository.save(dsa);

        DailyQuest workout = new DailyQuest();
        workout.setTitle("Titan Gym Protocol");
        workout.setDescription("Establish physical superiority by logging 1 workout today.");
        workout.setXpReward(150);
        workout.setType("WORKOUT");
        workout.setStatus("ACTIVE");
        workout.setAssignedDate(date);
        workout.setUser(user);
        dailyQuestRepository.save(workout);

        DailyQuest journal = new DailyQuest();
        journal.setTitle("Oracle Alignment");
        journal.setDescription("Cultivate inner wisdom. Log your daily journal.");
        journal.setXpReward(50);
        journal.setType("JOURNAL");
        journal.setStatus("ACTIVE");
        journal.setAssignedDate(date);
        journal.setUser(user);
        dailyQuestRepository.save(journal);
    }

    @Transactional
    public void checkAndCompleteQuest(User user, String type) {
        LocalDate today = LocalDate.now();
        List<DailyQuest> activeQuests = dailyQuestRepository.findByUserAndAssignedDateAndStatus(user, today, "ACTIVE");

        for (DailyQuest q : activeQuests) {
            if (q.getType().equalsIgnoreCase(type)) {
                q.setStatus("COMPLETED");
                q.setCompletedDate(today);
                dailyQuestRepository.save(q);
                gamificationService.awardBonusXp(user, type, q.getXpReward());
                break;
            }
        }
    }
}
