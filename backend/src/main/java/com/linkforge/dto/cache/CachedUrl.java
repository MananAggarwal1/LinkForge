package com.linkforge.dto.cache;

import java.io.Serializable;
import java.time.Instant;

public class CachedUrl implements Serializable {

    private String id;
    private String originalUrl;
    private String shortCode;
    private String userId;
    private boolean active;
    private boolean hasPassword;
    private String passwordHash;
    private Instant expiresAt;

    public CachedUrl() {
    }

    public CachedUrl(String id, String originalUrl, String shortCode, String userId,
                     boolean active, boolean hasPassword, String passwordHash, Instant expiresAt) {
        this.id = id;
        this.originalUrl = originalUrl;
        this.shortCode = shortCode;
        this.userId = userId;
        this.active = active;
        this.hasPassword = hasPassword;
        this.passwordHash = passwordHash;
        this.expiresAt = expiresAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public String getShortCode() {
        return shortCode;
    }

    public void setShortCode(String shortCode) {
        this.shortCode = shortCode;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isHasPassword() {
        return hasPassword;
    }

    public void setHasPassword(boolean hasPassword) {
        this.hasPassword = hasPassword;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }
}
