package com.linkforge.util;

import java.util.Locale;

/**
 * Lightweight, high-throughput User-Agent parser for click analytics.
 * Extracts device type, operating system, and browser without heavy external dependencies.
 */
public final class UserAgentParser {

    private UserAgentParser() {
    }

    public static String detectBrowser(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) {
            return "Unknown";
        }
        String ua = userAgent.toLowerCase(Locale.ROOT);

        if (ua.contains("edg/") || ua.contains("edge/")) {
            return "Edge";
        } else if (ua.contains("opr/") || ua.contains("opera")) {
            return "Opera";
        } else if (ua.contains("samsungbrowser")) {
            return "Samsung Internet";
        } else if (ua.contains("chrome") && !ua.contains("chromium")) {
            return "Chrome";
        } else if (ua.contains("firefox")) {
            return "Firefox";
        } else if (ua.contains("safari") && !ua.contains("chrome")) {
            return "Safari";
        }
        return "Other";
    }

    public static String detectOs(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) {
            return "Unknown";
        }
        String ua = userAgent.toLowerCase(Locale.ROOT);

        if (ua.contains("windows")) {
            return "Windows";
        } else if (ua.contains("iphone") || ua.contains("ipad") || ua.contains("ipod")) {
            return "iOS";
        } else if (ua.contains("mac os") || ua.contains("macintosh")) {
            return "macOS";
        } else if (ua.contains("android")) {
            return "Android";
        } else if (ua.contains("linux")) {
            return "Linux";
        }
        return "Other";
    }

    public static String detectDeviceType(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) {
            return "Desktop";
        }
        String ua = userAgent.toLowerCase(Locale.ROOT);

        if (ua.contains("tablet") || ua.contains("ipad")) {
            return "Tablet";
        } else if (ua.contains("mobile") || ua.contains("android") || ua.contains("iphone")) {
            return "Mobile";
        }
        return "Desktop";
    }

    public static String extractReferrerDomain(String referrer) {
        if (referrer == null || referrer.isBlank() || "direct".equalsIgnoreCase(referrer.trim())) {
            return "Direct";
        }
        try {
            String clean = referrer.trim();
            if (clean.startsWith("http://") || clean.startsWith("https://")) {
                java.net.URI uri = java.net.URI.create(clean);
                String host = uri.getHost();
                if (host != null) {
                    if (host.startsWith("www.")) {
                        host = host.substring(4);
                    }
                    if (host.contains("google.")) return "Google";
                    if (host.contains("t.co") || host.contains("twitter.") || host.contains("x.com")) return "Twitter / X";
                    if (host.contains("linkedin.")) return "LinkedIn";
                    if (host.contains("facebook.")) return "Facebook";
                    if (host.contains("instagram.")) return "Instagram";
                    if (host.contains("reddit.")) return "Reddit";
                    if (host.contains("youtube.")) return "YouTube";
                    if (host.contains("github.")) return "GitHub";
                    return host;
                }
            }
            return clean;
        } catch (Exception e) {
            return "Other";
        }
    }
}
