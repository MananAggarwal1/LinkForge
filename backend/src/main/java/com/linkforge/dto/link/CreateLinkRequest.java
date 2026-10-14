package com.linkforge.dto.link;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class CreateLinkRequest {

    @NotBlank(message = "Original URL cannot be blank")
    private String originalUrl;

    private String customSlug;

    private String title;

    private String description;

    private List<String> tags = new ArrayList<>();

    private Instant expiresAt;

    private String password;

    public CreateLinkRequest() {
    }

    public CreateLinkRequest(String originalUrl, String customSlug, String title) {
        this.originalUrl = originalUrl;
        this.customSlug = customSlug;
        this.title = title;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public String getCustomSlug() {
        return customSlug;
    }

    public void setCustomSlug(String customSlug) {
        this.customSlug = customSlug;
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
        this.tags = tags != null ? tags : new ArrayList<>();
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
