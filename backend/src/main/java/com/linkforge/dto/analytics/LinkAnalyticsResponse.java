package com.linkforge.dto.analytics;

import java.util.ArrayList;
import java.util.List;

public class LinkAnalyticsResponse {

    private String linkId;
    private String shortCode;
    private String originalUrl;
    private String title;
    private long totalClicks;
    private long uniqueVisitors;

    private List<ClickStatItem> clicksByDate = new ArrayList<>();
    private List<ClickStatItem> deviceBreakdown = new ArrayList<>();
    private List<ClickStatItem> browserBreakdown = new ArrayList<>();
    private List<ClickStatItem> osBreakdown = new ArrayList<>();
    private List<ClickStatItem> referrerBreakdown = new ArrayList<>();

    public LinkAnalyticsResponse() {
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

    public long getTotalClicks() {
        return totalClicks;
    }

    public void setTotalClicks(long totalClicks) {
        this.totalClicks = totalClicks;
    }

    public long getUniqueVisitors() {
        return uniqueVisitors;
    }

    public void setUniqueVisitors(long uniqueVisitors) {
        this.uniqueVisitors = uniqueVisitors;
    }

    public List<ClickStatItem> getClicksByDate() {
        return clicksByDate;
    }

    public void setClicksByDate(List<ClickStatItem> clicksByDate) {
        this.clicksByDate = clicksByDate;
    }

    public List<ClickStatItem> getDeviceBreakdown() {
        return deviceBreakdown;
    }

    public void setDeviceBreakdown(List<ClickStatItem> deviceBreakdown) {
        this.deviceBreakdown = deviceBreakdown;
    }

    public List<ClickStatItem> getBrowserBreakdown() {
        return browserBreakdown;
    }

    public void setBrowserBreakdown(List<ClickStatItem> browserBreakdown) {
        this.browserBreakdown = browserBreakdown;
    }

    public List<ClickStatItem> getOsBreakdown() {
        return osBreakdown;
    }

    public void setOsBreakdown(List<ClickStatItem> osBreakdown) {
        this.osBreakdown = osBreakdown;
    }

    public List<ClickStatItem> getReferrerBreakdown() {
        return referrerBreakdown;
    }

    public void setReferrerBreakdown(List<ClickStatItem> referrerBreakdown) {
        this.referrerBreakdown = referrerBreakdown;
    }
}
