package com.linkforge.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * System Design Note: Asynchronous & Decoupled Event Processing.
 * Provides a dedicated thread pool for non-blocking click tracking.
 * When millions of users follow short links, logging analytics to MongoDB
 * must never block the client's HTTP 302 redirection latency.
 */
@Configuration
public class AsyncConfig {

    @Bean(name = "analyticsTaskExecutor")
    public Executor analyticsTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("LinkForgeAnalytics-");
        executor.initialize();
        return executor;
    }
}
