package com.tracker.personal_tracker.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.tracker.personal_tracker.entity.DsaProblem;
import com.tracker.personal_tracker.repository.DsaRepository;
import com.tracker.personal_tracker.service.DailyQuestService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DsaService {
    private final DsaRepository dsaRepository;
    private final SystemGamificationService gamificationService;
    private final DailyQuestService dailyQuestService;

    public List<DsaProblem> getAllProblems() {
        return dsaRepository.findAll();
    }

    public DsaProblem saveProblem(DsaProblem problem) {
        // New problems added via API are always user-added (not predefined)
        problem.setPredefined(false); 
        DsaProblem saved = dsaRepository.save(problem);
        if ("Solved".equalsIgnoreCase(saved.getStatus())) {
            var user = gamificationService.getCurrentUser();
            gamificationService.awardDsaXp(user, saved.getDifficulty());
            dailyQuestService.checkAndCompleteQuest(user, "DSA");
        }
        return saved;
    }

    public DsaProblem updateProblem(Long id, DsaProblem updatedDetails) {
        DsaProblem existingProblem = dsaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Problem not found"));

        boolean justSolved = "Solved".equalsIgnoreCase(updatedDetails.getStatus()) && !"Solved".equalsIgnoreCase(existingProblem.getStatus());

        // System Design Guard: Only allow full modification if not predefined
        if (existingProblem.isPredefined()) {
            // Predefined problems: Only allow updating status and dates
            existingProblem.setStatus(updatedDetails.getStatus());
            existingProblem.setSolvedDate(updatedDetails.getSolvedDate());
            existingProblem.setRevisionDate(updatedDetails.getRevisionDate());
        } else {
            // User-added: Allow full modification
            existingProblem.setProblemName(updatedDetails.getProblemName());
            existingProblem.setTopic(updatedDetails.getTopic());
            existingProblem.setPatternType(updatedDetails.getPatternType());
            existingProblem.setLink(updatedDetails.getLink());
            existingProblem.setDifficulty(updatedDetails.getDifficulty());
            existingProblem.setStatus(updatedDetails.getStatus());
            existingProblem.setSolvedDate(updatedDetails.getSolvedDate());
            existingProblem.setRevisionDate(updatedDetails.getRevisionDate());
        }
        DsaProblem saved = dsaRepository.save(existingProblem);
        if (justSolved) {
            var user = gamificationService.getCurrentUser();
            gamificationService.awardDsaXp(user, saved.getDifficulty());
            dailyQuestService.checkAndCompleteQuest(user, "DSA");
        }
        return saved;
    }
    public void deleteProblem(Long id) {
        DsaProblem problem = dsaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Problem not found"));
        
        if (problem.isPredefined()) {
            throw new RuntimeException("Cannot delete predefined system problems!");
        }
        dsaRepository.deleteById(id);
    }
}
