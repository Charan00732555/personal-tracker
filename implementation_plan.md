# Gamification & Player Stats Implementation Plan

This document outlines the technical steps to transform the Personal Tracker into a fully-fledged "Solo Leveling" style RPG by introducing a Player entity, Experience Points (XP), and Streak mechanics.

## User Review Required

> [!IMPORTANT]  
> **User Concept**: Since full Authentication (Spring Security) is not yet implemented, the backend will auto-generate and manage a single, global "Player" profile (e.g., ID = 1). This ensures we can build the stat logic now and easily map it to individual users later when registration is added.

> [!NOTE]
> **Level Scaling Strategy**: For V1, we will implement the flat scaling discussed (100 XP = 1 Level). We can calculate the level dynamically in the backend: `Level = floor(XP / 100) + 1`. This makes it extremely easy to manage.

## Proposed Changes

### Backend: Database & Domain Layer

#### [NEW] `tracker-backend/src/main/java/com/tracker/personal_tracker/entity/PlayerStats.java`
- New JPA Entity to hold global XP logic.
- Fields: `id`, `strengthXp` (Workouts), `intelligenceXp` (DSA), `wisdomXp` (Journal).
- Fields for Streaks: `lastWorkoutDate`, `workoutStreak`, `lastJournalDate`, `journalStreak`.

#### [NEW] `tracker-backend/src/main/java/com/tracker/personal_tracker/repository/PlayerStatsRepository.java`
- Standard Spring Data JPA `JpaRepository<PlayerStats, Long>`.

#### [NEW] `tracker-backend/src/main/java/com/tracker/personal_tracker/dto/PlayerStatsDTO.java`
- Data Transfer Object to safely send levels and progress to the frontend.
- Will contain pre-calculated levels: `strLevel`, `intLevel`, `wisLevel`, and the current XP towards the next level (e.g., `strXpRemaining`).

---

### Backend: Service Logic (The "System")

#### [NEW] `tracker-backend/src/main/java/com/tracker/personal_tracker/service/SystemGamificationService.java`
- A centralized service responsible for dispensing XP and managing streaks.
- Methods: `awardWorkoutXp(LocalDate date)`, `awardDsaXp(String difficulty)`, `awardJournalXp(LocalDate date)`.
- Logic will include checking if an activity was already logged "today" to prevent spamming stats.

#### [MODIFY] `tracker-backend/src/main/java/com/tracker/personal_tracker/service/WorkoutService.java`
- Inject `SystemGamificationService`.
- On `saveWorkout(Workout workout)`: trigger `awardWorkoutXp()` giving +10 STR XP. Update daily streak if applicable.

#### [MODIFY] `tracker-backend/src/main/java/com/tracker/personal_tracker/service/DsaService.java`
- Inject `SystemGamificationService`.
- On marking a problem as solved: trigger `awardDsaXp()`.
- Give XP based on difficulty: Easy (+10), Medium (+20), Hard (+30).

#### [MODIFY] `tracker-backend/src/main/java/com/tracker/personal_tracker/service/JournalService.java`
- Inject `SystemGamificationService`.
- On saving an entry: trigger `awardJournalXp()`. Awards +10 WIS XP. Adds streak bonus (+15 XP) if a 3-day streak is reached.

#### [NEW] `tracker-backend/src/main/java/com/tracker/personal_tracker/controller/PlayerStatsController.java`
- REST Controller exposing a `/api/stats` endpoint to fetch the `PlayerStatsDTO` for the dashboard and stat screens.

---

### Frontend: UI & Components

#### [NEW] `tracker-frontend/src/api/statsApi.js`
- Setup Axios functions to `GET /api/stats`.

#### [MODIFY] `tracker-frontend/src/components/level-up/PlayerStatsCard.jsx`
- Replace hardcoded mock data (`stats.strength`, `stats.intelligence`, etc.) with live state mapped from the backend `PlayerStatsDTO`.
- Ensure the Radar Chart accurately reflects the ratio of the player's STR, INT, and WIS.

#### [MODIFY] `tracker-frontend/src/components/level-up/XpBar.jsx`
- Enhance the component to accept specific stat categories, such as `title="STRENGTH"`. 

#### [MODIFY] `tracker-frontend/src/pages/Dashboard.jsx`
- Wrap component in a `useEffect` to fetch player stats on load.
- Render `PlayerStatsCard` and potentially an overall "Main Level" `XpBar`.

#### [MODIFY] `tracker-frontend/src/pages/Workouts.jsx`, `DsaTracker.jsx`, `Journal.jsx`
- Fetch the specific stat layer context and render a relevant `XpBar` at the top of each page!
  - Workouts page will show the Strength `XpBar`.
  - DSA page will show the Intelligence `XpBar`.
  - Journal page will show the Wisdom `XpBar`.

## Open Questions
- > [!WARNING]  
  > **Re-calculation of existing data:** You currently have existing records in the database. When we launch this system, should we write a one-time script (or method) that retroactively grants XP based on all the past workouts/journals/dsa problems you've already saved? Or do you want to start from "Level 1" today moving forward?

## Verification Plan
### Automated & Manual Verification
- Compile and run Spring Boot Application. Ensure `PlayerStats` table is created. 
- Using testing (Postman/Frontend), perform 1 Workout, 1 Journal, and solve 1 DSA problem.
- Verify that the API output of `/api/stats` correctly reflects +10 STR, +10 WIS, and +X INT.
- Verify that the Frontend visually renders these XP boosts without error on the `XpBar` and Radar Charts.
