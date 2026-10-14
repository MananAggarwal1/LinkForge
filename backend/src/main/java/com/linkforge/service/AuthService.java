package com.linkforge.service;

import com.linkforge.config.JwtTokenProvider;
import com.linkforge.dto.auth.AuthResponse;
import com.linkforge.dto.auth.LoginRequest;
import com.linkforge.dto.auth.RegisterRequest;
import com.linkforge.dto.auth.UserProfileResponse;
import com.linkforge.exception.BadRequestException;
import com.linkforge.exception.ConflictException;
import com.linkforge.exception.UnauthorizedException;
import com.linkforge.model.UrlMapping;
import com.linkforge.model.User;
import com.linkforge.repository.ClickEventRepository;
import com.linkforge.repository.UrlMappingRepository;
import com.linkforge.repository.UserRepository;
import com.linkforge.util.SecurityUtil;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UrlMappingRepository urlMappingRepository;
    private final ClickEventRepository clickEventRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(
            UserRepository userRepository,
            UrlMappingRepository urlMappingRepository,
            ClickEventRepository clickEventRepository,
            RedisTemplate<String, Object> redisTemplate,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.urlMappingRepository = urlMappingRepository;
        this.clickEventRepository = clickEventRepository;
        this.redisTemplate = redisTemplate;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse register(RegisterRequest request) {
        String username = request.getUsername().trim().toLowerCase();
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByUsername(username)) {
            throw new ConflictException("Username '" + username + "' is already taken");
        }

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email '" + email + "' is already registered");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName() != null && !request.getFullName().isBlank() 
                ? request.getFullName().trim() : username);

        User savedUser = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(savedUser.getId(), savedUser.getUsername());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getFullName()
        );
    }

    public AuthResponse login(LoginRequest request) {
        String identifier = request.getUsernameOrEmail().trim().toLowerCase();

        User user = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getUsername());

        return new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName()
        );
    }

    public UserProfileResponse getCurrentUserProfile() {
        String userId = SecurityUtil.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User profile not found"));

        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getCreatedAt()
        );
    }

    @Transactional
    public void deleteCurrentUser() {
        String userId = SecurityUtil.getCurrentUserId();

        // 1. Purge Redis cache for all of user's links
        List<UrlMapping> userLinks = urlMappingRepository.findByUserIdOrderByCreatedAtDesc(userId);
        for (UrlMapping link : userLinks) {
            try {
                redisTemplate.delete("link:" + link.getShortCode());
            } catch (Exception ignored) {}
        }

        // 2. Cascade delete in MongoDB
        urlMappingRepository.deleteByUserId(userId);
        clickEventRepository.deleteByUserId(userId);
        userRepository.deleteById(userId);
    }
}
