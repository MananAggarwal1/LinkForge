package com.linkforge.service;

import com.linkforge.dto.cache.CachedUrl;
import com.linkforge.dto.link.RedirectResult;
import com.linkforge.exception.BadRequestException;
import com.linkforge.exception.ResourceNotFoundException;
import com.linkforge.exception.UnauthorizedException;
import com.linkforge.model.UrlMapping;
import com.linkforge.repository.UrlMappingRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

/**
 * System Design Note: High-Speed Redirection & Cache-Aside Architecture.
 * 1. Checks Redis cache (< 5ms).
 * 2. If Miss: queries MongoDB and populates Redis with TTL.
 * 3. Triggers asynchronous analytics logging.
 * 4. Yields destination URL for 302 Found response.
 */
@Service
public class RedirectService {

    private static final Logger log = LoggerFactory.getLogger(RedirectService.class);

    private final UrlMappingRepository urlMappingRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final AnalyticsService analyticsService;
    private final PasswordEncoder passwordEncoder;
    private final long defaultTtlSeconds;

    public RedirectService(
            UrlMappingRepository urlMappingRepository,
            RedisTemplate<String, Object> redisTemplate,
            AnalyticsService analyticsService,
            PasswordEncoder passwordEncoder,
            @Value("${linkforge.cache.default-ttl-seconds:86400}") long defaultTtlSeconds) {
        this.urlMappingRepository = urlMappingRepository;
        this.redisTemplate = redisTemplate;
        this.analyticsService = analyticsService;
        this.passwordEncoder = passwordEncoder;
        this.defaultTtlSeconds = defaultTtlSeconds;
    }

    public RedirectResult resolveRedirect(String shortCode, HttpServletRequest request) {
        String cacheKey = "link:" + shortCode;
        CachedUrl cached = null;

        // 1. Check Redis Cache
        try {
            Object cachedObj = redisTemplate.opsForValue().get(cacheKey);
            if (cachedObj instanceof CachedUrl) {
                cached = (CachedUrl) cachedObj;
            }
        } catch (Exception e) {
            log.warn("Redis read exception for key {}: {}. Falling back to database.", cacheKey, e.getMessage());
        }

        // 2. Cache Hit
        if (cached != null) {
            return processRedirect(cached.getId(), cached.getShortCode(), cached.getUserId(),
                    cached.getOriginalUrl(), cached.isActive(), cached.getExpiresAt(),
                    cached.isHasPassword(), request);
        }

        // 3. Cache Miss: Query MongoDB
        UrlMapping mapping = urlMappingRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL '" + shortCode + "' does not exist."));

        // Store into Redis Cache
        try {
            CachedUrl toCache = new CachedUrl(
                    mapping.getId(),
                    mapping.getOriginalUrl(),
                    mapping.getShortCode(),
                    mapping.getUserId(),
                    mapping.isActive(),
                    mapping.getPasswordHash() != null && !mapping.getPasswordHash().isBlank(),
                    mapping.getPasswordHash(),
                    mapping.getExpiresAt()
            );
            redisTemplate.opsForValue().set(cacheKey, toCache, Duration.ofSeconds(defaultTtlSeconds));
        } catch (Exception e) {
            log.warn("Redis write exception for key {}: {}", cacheKey, e.getMessage());
        }

        return processRedirect(mapping.getId(), mapping.getShortCode(), mapping.getUserId(),
                mapping.getOriginalUrl(), mapping.isActive(), mapping.getExpiresAt(),
                mapping.getPasswordHash() != null && !mapping.getPasswordHash().isBlank(), request);
    }

    public String verifyPasswordAndResolve(String shortCode, String password, HttpServletRequest request) {
        UrlMapping mapping = urlMappingRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL '" + shortCode + "' does not exist."));

        if (!mapping.isActive()) {
            throw new BadRequestException("This link is deactivated.");
        }
        if (mapping.getExpiresAt() != null && mapping.getExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("This link has expired.");
        }

        if (mapping.getPasswordHash() == null || mapping.getPasswordHash().isBlank()) {
            return mapping.getOriginalUrl();
        }

        if (!passwordEncoder.matches(password, mapping.getPasswordHash())) {
            throw new UnauthorizedException("Incorrect password for protected link.");
        }

        // Track click upon successful unlock
        logClick(mapping.getId(), mapping.getShortCode(), mapping.getUserId(), request);

        return mapping.getOriginalUrl();
    }

    private RedirectResult processRedirect(
            String id,
            String shortCode,
            String userId,
            String originalUrl,
            boolean active,
            Instant expiresAt,
            boolean hasPassword,
            HttpServletRequest request) {

        if (!active) {
            throw new BadRequestException("This short link has been disabled by its owner.");
        }

        if (expiresAt != null && expiresAt.isBefore(Instant.now())) {
            throw new BadRequestException("This short link has expired.");
        }

        if (hasPassword) {
            return RedirectResult.passwordRequired(shortCode, "Protected Link");
        }

        // Asynchronously record click
        logClick(id, shortCode, userId, request);

        return RedirectResult.direct(originalUrl);
    }

    private void logClick(String linkId, String shortCode, String userId, HttpServletRequest request) {
        String clientIp = extractClientIp(request);
        String userAgent = request.getHeader("User-Agent");
        String referrer = request.getHeader("Referer");

        analyticsService.recordClickAsync(linkId, shortCode, userId, clientIp, userAgent, referrer);
    }

    private String extractClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
