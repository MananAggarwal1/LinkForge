package com.linkforge.service;

import com.linkforge.dto.cache.CachedUrl;
import com.linkforge.dto.link.CreateLinkRequest;
import com.linkforge.dto.link.LinkResponse;
import com.linkforge.dto.link.UpdateLinkRequest;
import com.linkforge.exception.BadRequestException;
import com.linkforge.exception.ConflictException;
import com.linkforge.exception.ResourceNotFoundException;
import com.linkforge.model.UrlMapping;
import com.linkforge.repository.ClickEventRepository;
import com.linkforge.repository.UrlMappingRepository;
import com.linkforge.util.Base62Encoder;
import com.linkforge.util.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class LinkService {

    private static final Logger log = LoggerFactory.getLogger(LinkService.class);

    private static final Pattern SLUG_PATTERN = Pattern.compile("^[a-zA-Z0-9_-]{3,30}$");
    private static final Set<String> RESERVED_SLUGS = Set.of(
            "api", "auth", "login", "register", "r", "actuator", "error", "dashboard", "analytics", "links", "qr"
    );

    private final UrlMappingRepository urlMappingRepository;
    private final ClickEventRepository clickEventRepository;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<String, Object> redisTemplate;
    private final String baseRedirectUrl;
    private final long defaultTtlSeconds;

    public LinkService(
            UrlMappingRepository urlMappingRepository,
            ClickEventRepository clickEventRepository,
            PasswordEncoder passwordEncoder,
            RedisTemplate<String, Object> redisTemplate,
            @Value("${linkforge.app.base-redirect-url:http://localhost:8080/r/}") String baseRedirectUrl,
            @Value("${linkforge.cache.default-ttl-seconds:86400}") long defaultTtlSeconds) {
        this.urlMappingRepository = urlMappingRepository;
        this.clickEventRepository = clickEventRepository;
        this.passwordEncoder = passwordEncoder;
        this.redisTemplate = redisTemplate;
        this.baseRedirectUrl = baseRedirectUrl;
        this.defaultTtlSeconds = defaultTtlSeconds;
    }

    public LinkResponse createLink(CreateLinkRequest request) {
        String userId = SecurityUtil.getCurrentUserId();
        String normalizedUrl = normalizeUrl(request.getOriginalUrl());

        String shortCode;
        boolean isCustom = false;

        if (request.getCustomSlug() != null && !request.getCustomSlug().isBlank()) {
            shortCode = request.getCustomSlug().trim();
            validateCustomSlug(shortCode);
            if (urlMappingRepository.existsByShortCode(shortCode)) {
                throw new ConflictException("Custom alias '" + shortCode + "' is already in use");
            }
            isCustom = true;
        } else {
            shortCode = generateUniqueShortCode();
        }

        UrlMapping mapping = new UrlMapping();
        mapping.setUserId(userId);
        mapping.setOriginalUrl(normalizedUrl);
        mapping.setShortCode(shortCode);
        mapping.setCustomAlias(isCustom);
        mapping.setTitle(request.getTitle() != null && !request.getTitle().isBlank() 
                ? request.getTitle().trim() : deriveTitleFromUrl(normalizedUrl));
        mapping.setDescription(request.getDescription());
        mapping.setTags(request.getTags());
        mapping.setExpiresAt(request.getExpiresAt());
        mapping.setActive(true);
        mapping.setClickCount(0);

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            mapping.setPasswordHash(passwordEncoder.encode(request.getPassword().trim()));
        }

        UrlMapping saved = urlMappingRepository.save(mapping);

        // Populate Redis cache for instant first-time redirect
        cacheUrl(saved);

        return mapToResponse(saved);
    }

    public List<LinkResponse> getUserLinks(String search, String tag) {
        String userId = SecurityUtil.getCurrentUserId();
        List<UrlMapping> list;

        if (tag != null && !tag.isBlank()) {
            list = urlMappingRepository.findByUserIdAndTagsContainingIgnoreCase(userId, tag.trim());
        } else if (search != null && !search.isBlank()) {
            String query = search.trim();
            list = urlMappingRepository.findByUserIdAndTitleContainingIgnoreCaseOrOriginalUrlContainingIgnoreCaseOrShortCodeContainingIgnoreCase(
                    userId, query, query, query);
        } else {
            list = urlMappingRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }

        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public LinkResponse getLinkById(String id) {
        String userId = SecurityUtil.getCurrentUserId();
        UrlMapping mapping = urlMappingRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found or access denied"));
        return mapToResponse(mapping);
    }

    public LinkResponse updateLink(String id, UpdateLinkRequest request) {
        String userId = SecurityUtil.getCurrentUserId();
        UrlMapping mapping = urlMappingRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found or access denied"));

        if (request.getOriginalUrl() != null && !request.getOriginalUrl().isBlank()) {
            mapping.setOriginalUrl(normalizeUrl(request.getOriginalUrl()));
        }
        if (request.getTitle() != null) {
            mapping.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            mapping.setDescription(request.getDescription());
        }
        if (request.getTags() != null) {
            mapping.setTags(request.getTags());
        }
        if (request.getExpiresAt() != null) {
            mapping.setExpiresAt(request.getExpiresAt());
        }
        if (request.getActive() != null) {
            mapping.setActive(request.getActive());
        }
        if (request.isRemovePassword()) {
            mapping.setPasswordHash(null);
        } else if (request.getPassword() != null && !request.getPassword().isBlank()) {
            mapping.setPasswordHash(passwordEncoder.encode(request.getPassword().trim()));
        }

        UrlMapping updated = urlMappingRepository.save(mapping);

        // Invalidate or update cache in Redis
        cacheUrl(updated);

        return mapToResponse(updated);
    }

    public void deleteLink(String id) {
        String userId = SecurityUtil.getCurrentUserId();
        UrlMapping mapping = urlMappingRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found or access denied"));

        // Delete mapping and associated click analytics
        urlMappingRepository.deleteById(id);
        clickEventRepository.deleteByLinkId(id);

        // Evict key from Redis cache
        evictCache(mapping.getShortCode());
    }

    public LinkResponse toggleActiveStatus(String id) {
        String userId = SecurityUtil.getCurrentUserId();
        UrlMapping mapping = urlMappingRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found or access denied"));

        mapping.setActive(!mapping.isActive());
        UrlMapping updated = urlMappingRepository.save(mapping);

        cacheUrl(updated);
        return mapToResponse(updated);
    }

    private void cacheUrl(UrlMapping mapping) {
        try {
            CachedUrl cached = new CachedUrl(
                    mapping.getId(),
                    mapping.getOriginalUrl(),
                    mapping.getShortCode(),
                    mapping.getUserId(),
                    mapping.isActive(),
                    mapping.getPasswordHash() != null && !mapping.getPasswordHash().isBlank(),
                    mapping.getPasswordHash(),
                    mapping.getExpiresAt()
            );
            redisTemplate.opsForValue().set("link:" + mapping.getShortCode(), cached, Duration.ofSeconds(defaultTtlSeconds));
        } catch (Exception e) {
            log.warn("Redis unavailable for caching shortCode {}: {}", mapping.getShortCode(), e.getMessage());
        }
    }

    private void evictCache(String shortCode) {
        try {
            redisTemplate.delete("link:" + shortCode);
        } catch (Exception e) {
            log.warn("Redis unavailable for evicting shortCode {}: {}", shortCode, e.getMessage());
        }
    }

    private String generateUniqueShortCode() {
        for (int i = 0; i < 5; i++) {
            String candidate = Base62Encoder.generateRandomSlug(7);
            if (!RESERVED_SLUGS.contains(candidate.toLowerCase()) && !urlMappingRepository.existsByShortCode(candidate)) {
                return candidate;
            }
        }
        // Fallback with timestamp-based Base62
        return Base62Encoder.fromBase10(System.currentTimeMillis());
    }

    private void validateCustomSlug(String slug) {
        if (!SLUG_PATTERN.matcher(slug).matches()) {
            throw new BadRequestException("Custom slug must be 3-30 alphanumeric characters, hyphens, or underscores.");
        }
        if (RESERVED_SLUGS.contains(slug.toLowerCase())) {
            throw new BadRequestException("The slug '" + slug + "' is reserved by the system.");
        }
    }

    private String normalizeUrl(String url) {
        if (url == null || url.isBlank()) {
            throw new BadRequestException("Original URL cannot be empty");
        }
        String trimmed = url.trim();
        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
            trimmed = "https://" + trimmed;
        }
        return trimmed;
    }

    private String deriveTitleFromUrl(String url) {
        try {
            java.net.URI uri = java.net.URI.create(url);
            String host = uri.getHost();
            if (host != null) {
                return host.startsWith("www.") ? host.substring(4) : host;
            }
        } catch (Exception ignored) {
        }
        return "Short Link";
    }

    private String getEffectiveBaseRedirectUrl() {
        if (baseRedirectUrl != null && !baseRedirectUrl.contains("localhost:8080") && !baseRedirectUrl.isBlank()) {
            return baseRedirectUrl.endsWith("/") ? baseRedirectUrl : baseRedirectUrl + "/";
        }
        // Auto-detect public URL from current HTTP request headers (X-Forwarded-Host or Host)
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null && attrs.getRequest() != null) {
                HttpServletRequest req = attrs.getRequest();
                String proto = req.getHeader("X-Forwarded-Proto");
                if (proto == null || proto.isBlank()) {
                    proto = req.getScheme();
                }
                String host = req.getHeader("X-Forwarded-Host");
                if (host == null || host.isBlank()) {
                    host = req.getHeader("Host");
                }
                if (host != null && !host.isBlank() && !host.contains("localhost")) {
                    return proto + "://" + host + "/r/";
                }
            }
        } catch (Exception ignored) {
        }
        return baseRedirectUrl;
    }

    public LinkResponse mapToResponse(UrlMapping mapping) {
        LinkResponse response = new LinkResponse();
        response.setId(mapping.getId());
        response.setOriginalUrl(mapping.getOriginalUrl());
        response.setShortCode(mapping.getShortCode());
        response.setShortUrl(getEffectiveBaseRedirectUrl() + mapping.getShortCode());
        response.setTitle(mapping.getTitle());
        response.setDescription(mapping.getDescription());
        response.setTags(mapping.getTags());
        response.setCustomAlias(mapping.isCustomAlias());
        response.setHasPassword(mapping.getPasswordHash() != null && !mapping.getPasswordHash().isBlank());
        response.setExpiresAt(mapping.getExpiresAt());
        response.setActive(mapping.isActive());
        response.setClickCount(mapping.getClickCount());
        response.setCreatedAt(mapping.getCreatedAt());
        response.setUpdatedAt(mapping.getUpdatedAt());
        return response;
    }
}
