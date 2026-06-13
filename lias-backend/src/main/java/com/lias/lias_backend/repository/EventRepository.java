package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Event;
import com.lias.lias_backend.entity.enums.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

    List<Event> findByEventType(EventType eventType);

    List<Event> findByIsArchived(Boolean isArchived);

    List<Event> findByIsArchivedOrderByStartDateDesc(Boolean isArchived);

    @Query("SELECT e FROM Event e WHERE e.startDate >= :date ORDER BY e.startDate ASC")
    List<Event> findUpcomingEvents(@Param("date") LocalDate date);

    @Query("SELECT e FROM Event e WHERE e.startDate < :date ORDER BY e.startDate DESC")
    List<Event> findPastEvents(@Param("date") LocalDate date);

    @Query("SELECT e FROM Event e WHERE e.startDate BETWEEN :start AND :end ORDER BY e.startDate ASC")
    List<Event> findEventsBetweenDates(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT e FROM Event e WHERE LOWER(e.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Event> searchByTitle(@Param("searchTerm") String searchTerm);

    @Query("SELECT e FROM Event e WHERE e.parentEvent.id = :parentId")
    List<Event> findEventEditions(@Param("parentId") UUID parentId);

    @Query("SELECT e FROM Event e WHERE e.parentEvent IS NULL AND e.isArchived = false")
    List<Event> findTopLevelEvents();
}
