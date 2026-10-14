package com.linkforge.controller;

import com.linkforge.dto.analytics.DashboardOverviewResponse;
import com.linkforge.dto.analytics.LinkAnalyticsResponse;
import com.linkforge.service.AnalyticsService;
import com.linkforge.service.LinkService;
import com.linkforge.util.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/links")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final LinkService linkService;

    public AnalyticsController(AnalyticsService analyticsService, LinkService linkService) {
        this.analyticsService = analyticsService;
        this.linkService = linkService;
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<LinkAnalyticsResponse> getLinkAnalytics(@PathVariable String id) {
        String userId = SecurityUtil.getCurrentUserId();
        LinkAnalyticsResponse analytics = analyticsService.getLinkAnalytics(id, userId);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/dashboard/overview")
    public ResponseEntity<DashboardOverviewResponse> getDashboardOverview() {
        String userId = SecurityUtil.getCurrentUserId();
        DashboardOverviewResponse overview = analyticsService.getDashboardOverview(userId, linkService);
        return ResponseEntity.ok(overview);
    }
}
