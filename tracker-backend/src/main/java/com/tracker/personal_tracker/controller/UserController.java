package com.tracker.personal_tracker.controller;

import com.tracker.personal_tracker.dto.UserProfileDto;
import com.tracker.personal_tracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getMyProfile(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(userService.getUserProfile(username));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateMyProfile(Authentication authentication, @RequestBody UserProfileDto dto) {
        String currentUsername = authentication.getName();
        return ResponseEntity.ok(userService.updateUserProfile(currentUsername, dto));
    }
}
