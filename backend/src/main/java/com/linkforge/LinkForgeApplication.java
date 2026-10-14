package com.linkforge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * LinkForge Main Spring Boot Application.
 * Enables:
 * - Mongo Auditing for automatic @CreatedDate & @LastModifiedDate timestamps.
 * - Asynchronous execution for decoupled non-blocking analytics event logging.
 */
@SpringBootApplication
@EnableMongoAuditing
@EnableAsync
public class LinkForgeApplication {

    public static void main(String[] args) {
        SpringApplication.run(LinkForgeApplication.class, args);
    }
}
