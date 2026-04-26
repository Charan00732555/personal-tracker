# Personal Tracker 🚀
A full-stack application built with **Spring Boot 3 (Java 25)**, **React**, and **MySQL** to track DSA, Workouts, and System Design progress.

## 🛠 Tech Stack
- **Backend:** Spring Boot, Spring Data JPA, MySQL, Lombok
- **Frontend:** React, Vite, Tailwind CSS v4, Recharts, Lucide React
- **Environment:** Java 25.0.2, Node.js, Maven

## 📊 Project Status: [●●●●○] 80% Complete

---

## ✅ Progress Log

### Phase 1: Backend Foundations
- [x] Workspace Setup on D: Drive
- [x] Database Schema Creation (`personal_tracker_db`)
- [x] Spring Boot Project Initialization (Java 25)
- [x] **Workout Module:**
    - [x] Entity Design (One-to-Many logic for sets/reps)
    - [x] Repository Layer (JPA implementation)
    - [x] Service Layer (Business logic & Constructor Injection)
    - [x] Controller Layer (REST Endpoints)
    - [x] API Testing (Thunder Client verified)
- [x] **DSA & System Design Module:**
    - [x] Entity Design (isPredefined flag for data ownership)
    - [x] Custom Repository methods for pattern filtering
    - [x] Service Layer (Guard logic to protect core problems)
    - [x] Data Initializer (Seeding predefined problems on startup)
- [x] **Daily Journal Module:**
    - [x] Structured Entity Design (5-Question Reflection Model)
    - [x] Service Layer (Upsert logic to ensure one entry per day)

### Phase 2: Frontend Development
- [x] Initialize React + Vite project
- [x] Configure Tailwind CSS & Theme (Solo Leveling Aesthetic)
- [x] Build API Service layer (Axios)
- [x] Create Dashboard & Pillar Pages (Workout, DSA, Journal)
- [x] Integrate components like Recharts and Lucide-React

### Phase 3: Integration & Polish (Up Next)
- [ ] Refine responsive design and UI aesthetics
- [ ] Comprehensive End-to-End frontend/backend testing
- [ ] Deployment and hosting configurations

---

## 📝 Learning Notes (Tutor Sessions)
- **System Design:** Using `@ElementCollection` for normalizing sets/reps data.
- **Data Integrity:** Implementing "Guards" in the Service layer to distinguish between system-provided (Read-Only) and user-provided (Editable) data.
- **Persistence:** Using "Upsert" logic in the Journal module to prevent duplicate entries for the same date.
- **Modern Spring:** Leveraging `@RequiredArgsConstructor` and `final` fields for clean Constructor Injection.
- **Architecture:** Maintaining a Monolithic structure to master the full-stack flow before scaling.