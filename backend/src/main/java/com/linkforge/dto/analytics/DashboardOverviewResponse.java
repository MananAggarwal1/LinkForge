package com.linkforge.dto.analytics;

import com.linkforge.dto.link.LinkResponse;

import java.util.ArrayList;
import java.util.List;

public class DashboardOverviewResponse {

    private long totalLinks;
    private long activeLinks;
    private long totalClicks;
    private List<ClickStatItem> clicksByDate = new ArrayList<>();
    private List<LinkResponse> topLinks = new ArrayList<>();

    public DashboardOverviewResponse() {
    }

    public long getTotalLinks() {
        return totalLinks;
    }

    public void setTotalLinks(long totalLinks) {
        this.totalLinks = totalLinks;
    }

    public long getActiveLinks() {
        return activeLinks;
    }

    public void setActiveLinks(long activeLinks) {
        this.activeLinks = activeLinks;
    }

    public long getTotalClicks() {
        return totalClicks;
    }

    public void setTotalClicks(long totalClicks) {
        this.totalClicks = totalClicks;
    }

    public List<ClickStatItem> getClicksByDate() {
        return clicksByDate;
    }

    public void setClicksByDate(List<ClickStatItem> clicksByDate) {
        this.clicksByDate = clicksByDate;
    }

    public List<LinkResponse> getTopLinks() {
        return topLinks;
    }

    public void setTopLinks(List<LinkResponse> topLinks) {
        this.topLinks = topLinks;
    }
}
