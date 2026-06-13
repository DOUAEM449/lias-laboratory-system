package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Discussion;
import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    List<Message> findByDiscussion(Discussion discussion);

    List<Message> findBySender(Member member);

    @Query("SELECT m FROM Message m WHERE m.discussion.id = :discussionId AND m.isDeleted = false ORDER BY m.sentAt DESC")
    List<Message> findMessagesByDiscussion(@Param("discussionId") UUID discussionId);

    @Query("SELECT m FROM Message m WHERE m.sender.id = :senderId AND m.isDeleted = false ORDER BY m.sentAt DESC")
    List<Message> findMessagesBySender(@Param("senderId") UUID senderId);

    @Query("SELECT m FROM Message m WHERE m.discussion.id = :discussionId AND m.isDeleted = false ORDER BY m.sentAt ASC")
    List<Message> findMessagesOrderedBySentAt(@Param("discussionId") UUID discussionId);

    @Query("SELECT m FROM Message m WHERE m.sentAt BETWEEN :start AND :end AND m.isDeleted = false ORDER BY m.sentAt DESC")
    List<Message> findMessagesInPeriod(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.discussion.id = :discussionId AND m.isDeleted = false")
    Long countMessagesInDiscussion(@Param("discussionId") UUID discussionId);

    @Query("SELECT m FROM Message m WHERE m.isDeleted = false AND m.discussion.id = :discussionId ORDER BY m.sentAt DESC LIMIT 1")
    Message findLatestMessage(@Param("discussionId") UUID discussionId);
}
