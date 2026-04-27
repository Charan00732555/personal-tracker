package com.tracker.personal_tracker.service;

import com.tracker.personal_tracker.dto.UserProfileDto;
import com.tracker.personal_tracker.entity.User;
import com.tracker.personal_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileDto getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserProfileDto.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarId(user.getAvatarId())
                .build();
    }

    public UserProfileDto updateUserProfile(String currentUsername, UserProfileDto dto) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(dto.getUsername())) {
            if (userRepository.existsByUsername(dto.getUsername())) {
                throw new RuntimeException("Username already taken");
            }
            user.setUsername(dto.getUsername());
        }

        if (dto.getAvatarId() != null && !dto.getAvatarId().isEmpty()) {
            user.setAvatarId(dto.getAvatarId());
        }

        userRepository.save(user);

        return UserProfileDto.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarId(user.getAvatarId())
                .build();
    }
}
