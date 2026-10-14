package com.linkforge.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class UserAgentParserTest {

    @Test
    void testDetectBrowser() {
        String chromeUa = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
        assertEquals("Chrome", UserAgentParser.detectBrowser(chromeUa));

        String firefoxUa = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0";
        assertEquals("Firefox", UserAgentParser.detectBrowser(firefoxUa));

        String safariUa = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
        assertEquals("Safari", UserAgentParser.detectBrowser(safariUa));
    }

    @Test
    void testDetectOs() {
        String winUa = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
        assertEquals("Windows", UserAgentParser.detectOs(winUa));

        String macUa = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)";
        assertEquals("macOS", UserAgentParser.detectOs(macUa));

        String androidUa = "Mozilla/5.0 (Linux; Android 14; Pixel 8)";
        assertEquals("Android", UserAgentParser.detectOs(androidUa));
    }

    @Test
    void testDetectDeviceType() {
        String desktopUa = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
        assertEquals("Desktop", UserAgentParser.detectDeviceType(desktopUa));

        String mobileUa = "Mozilla/5.0 (Linux; Android 14; Mobile; Pixel 8)";
        assertEquals("Mobile", UserAgentParser.detectDeviceType(mobileUa));

        String tabletUa = "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)";
        assertEquals("Tablet", UserAgentParser.detectDeviceType(tabletUa));
    }

    @Test
    void testExtractReferrerDomain() {
        assertEquals("Direct", UserAgentParser.extractReferrerDomain(null));
        assertEquals("Direct", UserAgentParser.extractReferrerDomain(""));
        assertEquals("Google", UserAgentParser.extractReferrerDomain("https://www.google.com/search?q=linkforge"));
        assertEquals("Twitter / X", UserAgentParser.extractReferrerDomain("https://t.co/abc123xyz"));
        assertEquals("GitHub", UserAgentParser.extractReferrerDomain("https://github.com/MananAggarwal1"));
    }
}
