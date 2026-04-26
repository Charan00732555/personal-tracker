package com.tracker.personal_tracker.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String username; // primary identifier for login and registration
    private String email;
    private String password;
}
