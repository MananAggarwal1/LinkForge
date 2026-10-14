package com.linkforge.repository;

import com.linkforge.model.ClickEvent;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ClickEventRepository extends MongoRepository<ClickEvent, String> {

    List<ClickEvent> findByLinkId(String linkId, Sort sort);

    List<ClickEvent> findByLinkIdAndTimestampBetween(String linkId, Instant from, Instant to, Sort sort);

    List<ClickEvent> findByUserId(String userId, Sort sort);

    List<ClickEvent> findByUserIdAndTimestampBetween(String userId, Instant from, Instant to, Sort sort);

    long countByLinkId(String linkId);

    long countByUserId(String userId);

    void deleteByLinkId(String linkId);

    void deleteByUserId(String userId);
}
