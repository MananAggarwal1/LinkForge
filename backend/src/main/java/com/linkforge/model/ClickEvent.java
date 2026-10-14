package com.linkforge.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * MongoDB Entity for recording each individual click event.
 * Compound index on (linkId, timestamp) enables high-speed time-series queries.
 */
@Document(collection = "click_events")
@CompoundIndex(name = "link_time_idx", def = "{'linkId': 1, 'timestamp': -1}")
@CompoundIndex(name = "user_time_idx", def = "{'userId': 1, 'timestamp': -1}")
public class ClickEvent {

    @Id
    private String id;

    @Indexed
    private String linkId;

    @Indexed
    private String shortCode;

    @Indexed
    private String userId;

    @CreatedDate
    private Instant timestamp;

    private String ipAddress;

    private String userAgent;

    private String browser;

    private String os;

    private String deviceType; // Desktop, Mobile, Tablet

    private String referrer; // Direct, Google, Twitter, LinkedIn, etc.

    private String country;

    public ClickEvent() {
    }

    public ClickEvent(String linkId, String shortCode, String userId, String ipAddress,
                      String userAgent, String browser, String os, String deviceType,
                      String referrer, String country) {
        this.linkId = linkId;
        this.shortCode = shortCode;
        this.userId = userId;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.browser = browser;
        this.os = os;
        this.deviceType = deviceType;
        this.referrer = referrer;
        this.country = country;
        this.timestamp = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLinkId() {
        return linkId;
    }

    public void setLinkId(String linkId) {
        this.linkId = linkId;
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

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getBrowser() {
        return browser;
    }

    public void setBrowser(String browser) {
        this.browser = browser;
    }

    public String getOs() {
        return os;
    }

    public void setOs(String os) {
        this.os = os;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public String getReferrer() {
        return referrer;
    }

    public void setReferrer(String referrer) {
        this.referrer = referrer;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
