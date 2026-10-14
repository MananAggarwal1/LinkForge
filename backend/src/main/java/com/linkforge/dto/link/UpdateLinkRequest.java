package com.linkforge.dto.link;

import java.time.Instant;
import java.util.List;

public class UpdateLinkRequest {

    private String originalUrl;
    private String title;
    private String description;
    private List<String> tags;
    private Instant expiresAt;
    private Boolean active;
    private String password;
    private boolean removePassword;

    public UpdateLinkRequest() {
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isRemovePassword() {
        return removePassword;
    }

    public void setRemovePassword(boolean removePassword) {
        this.removePassword = removePassword;
    }
}
