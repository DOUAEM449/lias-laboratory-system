package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.entity.Notification;
import com.lias.lias_backend.entity.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByMember(Member member);

    List<Notification> findByType(NotificationType type);

    List<Notification> findByIsRead(Boolean isRead);

    @Query("SELECT n FROM Notification n WHERE n.member.id = :memberId ORDER BY n.createdAt DESC")
    List<Notification> findNotificationsByMember(@Param("memberId") UUID memberId);

    @Query("SELECT n FROM Notification n WHERE n.member.id = :memberId AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findUnreadNotificationsByMember(@Param("memberId") UUID memberId);

    @Query("SELECT n FROM Notification n WHERE n.member.id = :memberId AND n.type = :type ORDER BY n.createdAt DESC")
    List<Notification> findNotificationsByMemberAndType(@Param("memberId") UUID memberId, @Param("type") NotificationType type);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.member.id = :memberId AND n.isRead = false")
    Long countUnreadNotifications(@Param("memberId") UUID memberId);

    @Query("SELECT n FROM Notification n WHERE n.createdAt BETWEEN :start AND :end ORDER BY n.createdAt DESC")
    List<Notification> findNotificationsInPeriod(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);

    @Query("SELECT n FROM Notification n WHERE n.member.id = :memberId ORDER BY n.createdAt DESC LIMIT 10")
    List<Notification> findRecentNotifications(@Param("memberId") UUID memberId);
}
