package com.tracker.personal_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tracker.personal_tracker.entity.DsaProblem;

@Repository
public interface DsaRepository extends JpaRepository<DsaProblem, Long> {
    // No code needed! JpaRepository gives you save(), findById(), etc.
}
