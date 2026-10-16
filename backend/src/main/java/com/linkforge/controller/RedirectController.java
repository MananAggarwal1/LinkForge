package com.linkforge.controller;

import com.linkforge.dto.link.PasswordVerifyRequest;
import com.linkforge.dto.link.RedirectResult;
import com.linkforge.exception.ResourceNotFoundException;
import com.linkforge.model.UrlMapping;
import com.linkforge.repository.UrlMappingRepository;
import com.linkforge.service.QrCodeService;
import com.linkforge.service.RedirectService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

/**
 * Public URL Redirection & Telemetry Controller.
 * Unauthenticated endpoints that handle high-throughput 302 redirects & public QR rendering.
 */
@RestController
@RequestMapping("/r")
public class RedirectController {

    private final RedirectService redirectService;
    private final QrCodeService qrCodeService;
    private final UrlMappingRepository urlMappingRepository;
    private final String baseRedirectUrl;

    public RedirectController(
            RedirectService redirectService,
            QrCodeService qrCodeService,
            UrlMappingRepository urlMappingRepository,
            @Value("${linkforge.app.base-redirect-url:http://localhost:8080/r/}") String baseRedirectUrl) {
        this.redirectService = redirectService;
        this.qrCodeService = qrCodeService;
        this.urlMappingRepository = urlMappingRepository;
        this.baseRedirectUrl = baseRedirectUrl;
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<?> redirect(
            @PathVariable String shortCode,
            HttpServletRequest request,
            @RequestHeader(value = HttpHeaders.ACCEPT, defaultValue = "") String acceptHeader) {

        RedirectResult result = redirectService.resolveRedirect(shortCode, request);

        if (result.isPasswordRequired()) {
            if (acceptHeader.contains(MediaType.TEXT_HTML_VALUE)) {
                return ResponseEntity.ok()
                        .contentType(MediaType.TEXT_HTML)
                        .body(buildPasswordPromptHtml(shortCode));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "passwordRequired", true,
                    "shortCode", shortCode,
                    "message", "This link is password protected. Submit your password to /r/" + shortCode + "/verify"
            ));
        }

        // Return standard HTTP 302 Found Redirection
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(result.getDestinationUrl()))
                .build();
    }

    private String getEffectiveBaseRedirectUrl(HttpServletRequest req) {
        if (baseRedirectUrl != null && !baseRedirectUrl.contains("localhost:8080") && !baseRedirectUrl.isBlank()) {
            return baseRedirectUrl.endsWith("/") ? baseRedirectUrl : baseRedirectUrl + "/";
        }
        if (req != null) {
            String proto = req.getHeader("X-Forwarded-Proto");
            if (proto == null || proto.isBlank()) {
                proto = req.getScheme();
            }
            String host = req.getHeader("X-Forwarded-Host");
            if (host == null || host.isBlank()) {
                host = req.getHeader("Host");
            }
            if (host != null && !host.isBlank() && !host.contains("localhost")) {
                return proto + "://" + host + "/r/";
            }
        }
        return baseRedirectUrl;
    }

    @GetMapping("/{shortCode}/qr")
    public ResponseEntity<byte[]> getPublicQrCode(
            @PathVariable String shortCode,
            @RequestParam(defaultValue = "350") int size,
            HttpServletRequest request) {

        UrlMapping mapping = urlMappingRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL '" + shortCode + "' does not exist."));

        String fullUrl = getEffectiveBaseRedirectUrl(request) + mapping.getShortCode();
        int dimension = Math.min(Math.max(size, 150), 1000);
        byte[] qrBytes = qrCodeService.generateQrCodePng(fullUrl, dimension, dimension);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"linkforge-qr-" + shortCode + ".png\"")
                .body(qrBytes);
    }

    @PostMapping("/{shortCode}/verify")
    public ResponseEntity<Map<String, String>> verifyPassword(
            @PathVariable String shortCode,
            @Valid @RequestBody PasswordVerifyRequest request,
            HttpServletRequest httpRequest) {

        String originalUrl = redirectService.verifyPasswordAndResolve(shortCode, request.getPassword(), httpRequest);
        return ResponseEntity.ok(Map.of(
                "destinationUrl", originalUrl,
                "shortCode", shortCode
        ));
    }

    private String buildPasswordPromptHtml(String shortCode) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>LinkForge - Password Protected Link</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-slate-900 text-slate-100 min-h-screen flex items-center justify-center p-4">
                <div class="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                    <div class="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <h2 class="text-2xl font-bold text-center mb-1">Protected Link</h2>
                    <p class="text-slate-400 text-center text-sm mb-6">This LinkForge destination requires a password to access.</p>
                    <form id="unlockForm" class="space-y-4">
                        <div>
                            <input id="pwdInput" type="password" placeholder="Enter link password" required class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                        </div>
                        <p id="err" class="text-rose-400 text-xs hidden"></p>
                        <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition shadow-lg shadow-indigo-600/30">
                            Unlock & Continue
                        </button>
                    </form>
                </div>
                <script>
                    const form = document.getElementById('unlockForm');
                    const err = document.getElementById('err');
                    form.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        err.classList.add('hidden');
                        const password = document.getElementById('pwdInput').value;
                        try {
                            const res = await fetch('/r/%s/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ password })
                            });
                            if (!res.ok) throw new Error('Incorrect password');
                            const data = await res.json();
                            window.location.href = data.destinationUrl;
                        } catch (e) {
                            err.textContent = e.message || 'Failed to verify password';
                            err.classList.remove('hidden');
                        }
                    });
                </script>
            </body>
            </html>
            """.formatted(shortCode);
    }
}
