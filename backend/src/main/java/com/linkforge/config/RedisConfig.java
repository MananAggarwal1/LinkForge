package com.linkforge.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.net.URI;
import java.time.Duration;

/**
 * System Design Note: High-Speed In-Memory Caching with Redis.
 * Redis acts as the Level-1 cache in our Cache-Aside pattern.
 * Supports local instances, cloud instances (Upstash / Redis Cloud),
 * and standard rediss:// TLS connection strings.
 */
@Configuration
public class RedisConfig {

    private static final Logger log = LoggerFactory.getLogger(RedisConfig.class);

    @Bean
    public RedisConnectionFactory redisConnectionFactory(
            @Value("${spring.data.redis.url:}") String redisUrl,
            @Value("${spring.data.redis.host:localhost}") String host,
            @Value("${spring.data.redis.port:6379}") int port,
            @Value("${spring.data.redis.password:}") String password,
            @Value("${spring.data.redis.ssl.enabled:false}") boolean sslEnabled,
            @Value("${spring.data.redis.timeout:3000ms}") Duration timeout) {

        LettuceClientConfiguration.LettuceClientConfigurationBuilder clientConfigBuilder =
                LettuceClientConfiguration.builder().commandTimeout(timeout);

        RedisStandaloneConfiguration serverConfig;

        if (redisUrl != null && !redisUrl.isBlank()) {
            try {
                URI uri = URI.create(redisUrl.trim());
                serverConfig = new RedisStandaloneConfiguration();
                serverConfig.setHostName(uri.getHost());
                serverConfig.setPort(uri.getPort() > 0 ? uri.getPort() : 6379);

                if (uri.getUserInfo() != null) {
                    String[] userInfo = uri.getUserInfo().split(":", 2);
                    if (userInfo.length > 1) {
                        serverConfig.setPassword(userInfo[1]);
                        if (!userInfo[0].isBlank()) {
                            serverConfig.setUsername(userInfo[0]);
                        }
                    } else if (userInfo.length == 1 && !userInfo[0].isBlank()) {
                        serverConfig.setPassword(userInfo[0]);
                    }
                }

                if ("rediss".equalsIgnoreCase(uri.getScheme())) {
                    clientConfigBuilder.useSsl();
                }
                log.info("Initialized Redis via REDIS_URL for host: {}, port: {}, ssl: {}",
                        serverConfig.getHostName(), serverConfig.getPort(), "rediss".equalsIgnoreCase(uri.getScheme()));
            } catch (Exception e) {
                log.warn("Could not parse REDIS_URL '{}', falling back to host/port: {}", redisUrl, e.getMessage());
                serverConfig = new RedisStandaloneConfiguration(host, port);
            }
        } else {
            serverConfig = new RedisStandaloneConfiguration(host, port);
            if (password != null && !password.isBlank()) {
                serverConfig.setPassword(password.trim());
            }
            if (sslEnabled) {
                clientConfigBuilder.useSsl();
            }
            log.info("Initialized Redis for host: {}, port: {}, ssl: {}", host, port, sslEnabled);
        }

        LettuceConnectionFactory factory = new LettuceConnectionFactory(serverConfig, clientConfigBuilder.build());
        factory.afterPropertiesSet();
        return factory;
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // Keys are human-readable Strings (e.g. "link:xyz123")
        StringRedisSerializer stringSerializer = new StringRedisSerializer();
        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);

        // Values are serialized as JSON
        GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer();
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);

        template.afterPropertiesSet();
        return template;
    }
}
