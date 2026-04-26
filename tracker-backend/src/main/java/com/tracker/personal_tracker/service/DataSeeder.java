package com.tracker.personal_tracker.service;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.json.JsonReadFeature;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tracker.personal_tracker.entity.DsaProblem;
import com.tracker.personal_tracker.repository.DsaRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final DsaRepository dsaRepository;

    @Override
    public void run(String... args) throws Exception {
        if (dsaRepository.count() == 0) {
            log.info("Populating DSA Tracker with 150 predefined patterns...");
            ObjectMapper objectMapper = new ObjectMapper();
            try (InputStream is = getClass().getResourceAsStream("/dsa_problems.json")) {
                objectMapper.configure(JsonReadFeature.ALLOW_NON_NUMERIC_NUMBERS.mappedFeature(), true);
                List<Map<String, Object>> rawData = objectMapper.readValue(is, new TypeReference<List<Map<String, Object>>>() {});
                
                for (Map<String, Object> data : rawData) {
                    String pattern = (String) data.get("Pattern");
                    String problemName = (String) data.get("Problem");
                    String difficulty = (String) data.get("Difficulty");
                    String link = (String) data.get("Link");
                    
                    if (pattern == null || problemName == null) continue;

                    DsaProblem problem = new DsaProblem();
                    problem.setPatternType(pattern);
                    problem.setProblemName(problemName);
                    problem.setDifficulty(difficulty);
                    problem.setLink(link);
                    problem.setStatus("Pending");
                    problem.setPredefined(true);
                    
                    // Assign topic based on pattern
                    problem.setTopic(determineTopic(pattern));
                    
                    dsaRepository.save(problem);
                }
                log.info("System successfully synced 150 problems to database.");
            } catch (Exception e) {
                log.error("Failed to seed initial data", e);
            }
        }
    }

    private String determineTopic(String pattern) {
        if (pattern == null) return "Other";
        switch (pattern) {
            case "Backtracking": return "Backtracking/Recursion";
            case "Binary Tree Traversal": return "Tree";
            case "Breadth-First Search (BFS)": return "Graph/Tree";
            case "Depth-First Search (DFS)": return "Graph/Tree";
            case "Dynamic Programming": return "DP";
            case "Fast & Slow Pointers": return "Linked List";
            case "LinkedList In-place Reversal": return "Linked List";
            case "Matrix Traversal": return "Matrix";
            case "Modified Binary Search": return "Binary Search";
            case "Monotonic Stack": return "Stack";
            case "Overlapping Intervals": return "Intervals";
            case "Prefix Sum": return "Array";
            case "Sliding Window": return "Array/String";
            case "Top K Elements": return "Heap";
            case "Two Pointers": return "Array/String";
            default: return "Other";
        }
    }
}
