package com.linkforge.service;

import com.linkforge.dto.analytics.ClickStatItem;
import com.linkforge.dto.analytics.DashboardOverviewResponse;
import com.linkforge.dto.analytics.LinkAnalyticsResponse;
import com.linkforge.dto.link.LinkResponse;
import com.linkforge.exception.ResourceNotFoundException;
import com.linkforge.model.ClickEvent;
import com.linkforge.model.UrlMapping;
import com.linkforge.repository.ClickEventRepository;
import com.linkforge.repository.UrlMappingRepository;
import com.linkforge.util.UserAgentParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * System Design Note: High-Throughput Analytics & Asynchronous Processing.
 * Click telemetry is executed asynchronously in a thread pool to preserve
 * low-latency (<10ms) HTTP redirects.
 */
@Service
public class AnalyticsService {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final ClickEventRepository clickEventRepository;
    private final UrlMappingRepository urlMappingRepository;

    public AnalyticsService(
            ClickEventRepository clickEventRepository,
            UrlMappingRepository urlMappingRepository) {
        this.clickEventRepository = clickEventRepository;
        this.urlMappingRepository = urlMappingRepository;
    }

    /**
     * Asynchronously logs click events in a background worker thread.
     */
    @Async("analyticsTaskExecutor")
    public void recordClickAsync(
            String linkId,
            String shortCode,
            String userId,
            String ipAddress,
            String userAgent,
            String referrerHeader) {

        try {
            String browser = UserAgentParser.detectBrowser(userAgent);
            String os = UserAgentParser.detectOs(userAgent);
            String device = UserAgentParser.detectDeviceType(userAgent);
            String referrer = UserAgentParser.extractReferrerDomain(referrerHeader);

            ClickEvent event = new ClickEvent(
                    linkId,
                    shortCode,
                    userId,
                    ipAddress != null ? ipAddress : "0.0.0.0",
                    userAgent,
                    browser,
                    os,
                    device,
                    referrer,
                    "Unknown"
            );

            clickEventRepository.save(event);

            // Increment link counter in MongoDB
            urlMappingRepository.findById(linkId).ifPresent(mapping -> {
                mapping.setClickCount(mapping.getClickCount() + 1);
                urlMappingRepository.save(mapping);
            });

        } catch (Exception ex) {
            log.error("Failed to asynchronously record click for shortCode {}: {}", shortCode, ex.getMessage());
        }
    }

    public LinkAnalyticsResponse getLinkAnalytics(String linkId, String userId) {
        UrlMapping mapping = urlMappingRepository.findByIdAndUserId(linkId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found or access denied"));

        List<ClickEvent> events = clickEventRepository.findByLinkId(linkId, Sort.by(Sort.Direction.DESC, "timestamp"));

        LinkAnalyticsResponse response = new LinkAnalyticsResponse();
        response.setLinkId(mapping.getId());
        response.setShortCode(mapping.getShortCode());
        response.setOriginalUrl(mapping.getOriginalUrl());
        response.setTitle(mapping.getTitle());
        response.setTotalClicks(events.size());

        // Approximate unique visitors by unique IP
        long uniqueIps = events.stream().map(ClickEvent::getIpAddress).filter(Objects::nonNull).distinct().count();
        response.setUniqueVisitors(uniqueIps);

        // Calculate breakdown metrics
        response.setClicksByDate(calculateTimeSeriesStats(events, 14));
        response.setDeviceBreakdown(calculateCategoricalStats(events.stream().map(ClickEvent::getDeviceType)));
        response.setBrowserBreakdown(calculateCategoricalStats(events.stream().map(ClickEvent::getBrowser)));
        response.setOsBreakdown(calculateCategoricalStats(events.stream().map(ClickEvent::getOs)));
        response.setReferrerBreakdown(calculateCategoricalStats(events.stream().map(ClickEvent::getReferrer)));

        return response;
    }

    public DashboardOverviewResponse getDashboardOverview(String userId, LinkService linkService) {
        long totalLinks = urlMappingRepository.countByUserId(userId);
        long activeLinks = urlMappingRepository.countByUserIdAndActive(userId, true);

        Instant thirtyDaysAgo = Instant.now().minus(30, ChronoUnit.DAYS);
        List<ClickEvent> userEvents = clickEventRepository.findByUserIdAndTimestampBetween(
                userId, thirtyDaysAgo, Instant.now(), Sort.by(Sort.Direction.ASC, "timestamp"));

        DashboardOverviewResponse overview = new DashboardOverviewResponse();
        overview.setTotalLinks(totalLinks);
        overview.setActiveLinks(activeLinks);
        overview.setTotalClicks(clickEventRepository.countByUserId(userId));
        overview.setClicksByDate(calculateTimeSeriesStats(userEvents, 14));

        List<UrlMapping> allLinks = urlMappingRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<LinkResponse> topLinks = allLinks.stream()
                .sorted((a, b) -> Long.compare(b.getClickCount(), a.getClickCount()))
                .limit(5)
                .map(linkService::mapToResponse)
                .collect(Collectors.toList());

        overview.setTopLinks(topLinks);

        return overview;
    }

    private List<ClickStatItem> calculateTimeSeriesStats(List<ClickEvent> events, int days) {
        Map<String, Long> dateCounts = new TreeMap<>();
        LocalDate today = LocalDate.now(ZoneId.of("UTC"));

        for (int i = days - 1; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            dateCounts.put(d.format(DATE_FORMATTER), 0L);
        }

        for (ClickEvent event : events) {
            if (event.getTimestamp() != null) {
                LocalDate eventDate = event.getTimestamp().atZone(ZoneId.of("UTC")).toLocalDate();
                String key = eventDate.format(DATE_FORMATTER);
                if (dateCounts.containsKey(key)) {
                    dateCounts.put(key, dateCounts.get(key) + 1);
                }
            }
        }

        return dateCounts.entrySet().stream()
                .map(entry -> new ClickStatItem(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    private List<ClickStatItem> calculateCategoricalStats(java.util.stream.Stream<String> stream) {
        List<String> list = stream.filter(s -> s != null && !s.isBlank()).collect(Collectors.toList());
        if (list.isEmpty()) {
            return Collections.emptyList();
        }

        long total = list.size();
        Map<String, Long> countMap = list.stream()
                .collect(Collectors.groupingBy(s -> s, Collectors.counting()));

        return countMap.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .limit(8)
                .map(e -> {
                    double pct = (e.getValue() * 100.0) / total;
                    return new ClickStatItem(e.getKey(), e.getValue(), Math.round(pct * 10.0) / 10.0);
                })
                .collect(Collectors.toList());
    }
}
