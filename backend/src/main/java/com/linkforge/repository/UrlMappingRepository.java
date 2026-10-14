package com.linkforge.repository;

import com.linkforge.model.UrlMapping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlMappingRepository extends MongoRepository<UrlMapping, String> {

    // Public redirection lookup
    Optional<UrlMapping> findByShortCode(String shortCode);

    boolean existsByShortCode(String shortCode);

    // Multi-tenant user-scoped queries
    List<UrlMapping> findByUserIdOrderByCreatedAtDesc(String userId);

    Page<UrlMapping> findByUserId(String userId, Pageable pageable);

    Optional<UrlMapping> findByIdAndUserId(String id, String userId);

    Optional<UrlMapping> findByShortCodeAndUserId(String shortCode, String userId);

    boolean existsByIdAndUserId(String id, String userId);

    void deleteByIdAndUserId(String id, String userId);

    void deleteByUserId(String userId);

    long countByUserId(String userId);

    long countByUserIdAndActive(String userId, boolean active);

    List<UrlMapping> findByUserIdAndTagsContainingIgnoreCase(String userId, String tag);

    List<UrlMapping> findByUserIdAndTitleContainingIgnoreCaseOrOriginalUrlContainingIgnoreCaseOrShortCodeContainingIgnoreCase(
            String userId, String title, String originalUrl, String shortCode);
}
