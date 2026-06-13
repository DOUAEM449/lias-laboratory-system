package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Meeting;
import com.lias.lias_backend.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, UUID> {

    List<Meeting> findByTeam(Team team);

    List<Meeting> findByIsArchived(Boolean isArchived);

    @Query("SELECT m FROM Meeting m WHERE m.scheduledAt >= :now ORDER BY m.scheduledAt ASC")
    List<Meeting> findUpcomingMeetings(@Param("now") OffsetDateTime now);

    @Query("SELECT m FROM Meeting m WHERE m.scheduledAt < :now ORDER BY m.scheduledAt DESC")
    List<Meeting> findPastMeetings(@Param("now") OffsetDateTime now);

    @Query("SELECT m FROM Meeting m WHERE m.scheduledAt BETWEEN :start AND :end ORDER BY m.scheduledAt ASC")
    List<Meeting> findMeetingsBetweenDates(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);

    @Query("SELECT m FROM Meeting m WHERE m.team.id = :teamId ORDER BY m.scheduledAt DESC")
    List<Meeting> findTeamMeetings(@Param("teamId") UUID teamId);

    @Query("SELECT m FROM Meeting m WHERE m.team IS NULL ORDER BY m.scheduledAt DESC")
    List<Meeting> findLabMeetings();

    @Query("SELECT m FROM Meeting m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Meeting> searchByTitle(@Param("searchTerm") String searchTerm);

    @Query("SELECT m FROM Meeting m WHERE m.minutesUrl IS NOT NULL ORDER BY m.scheduledAt DESC")
    List<Meeting> findMeetingsWithMinutes();
}
