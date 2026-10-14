package com.linkforge.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Root health endpoint for cloud hosting platforms (Render, Koyeb, AWS ALB)
 * to verify that the container is healthy and responding to HTTP traffic.
 */
@RestController
public class RootHealthController {

    @GetMapping({"/", "/health"})
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "LinkForge Backend API",
                "version", "1.0.0",
                "timestamp", System.currentTimeMillis()
        ));
    }
}
