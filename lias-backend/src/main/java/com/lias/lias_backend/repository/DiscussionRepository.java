package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Discussion;
import com.lias.lias_backend.entity.Event;
import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.entity.Team;
import com.lias.lias_backend.entity.enums.DiscussionScope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, UUID> {

    List<Discussion> findByScope(DiscussionScope scope);

    List<Discussion> findByTeam(Team team);

    List<Discussion> findByEvent(Event event);

    List<Discussion> findByCreatedBy(Member member);

    @Query("SELECT d FROM Discussion d WHERE d.scope = 'TEAM' AND d.team.id = :teamId ORDER BY d.createdAt DESC")
    List<Discussion> findTeamDiscussions(@Param("teamId") UUID teamId);

    @Query("SELECT d FROM Discussion d WHERE d.scope = 'EVENT' AND d.event.id = :eventId ORDER BY d.createdAt DESC")
    List<Discussion> findEventDiscussions(@Param("eventId") UUID eventId);

    @Query("SELECT d FROM Discussion d JOIN d.participants p WHERE p.id = :memberId AND d.scope = 'DIRECT' ORDER BY d.createdAt DESC")
    List<Discussion> findDirectMessageThreads(@Param("memberId") UUID memberId);

    @Query("SELECT d FROM Discussion d WHERE LOWER(d.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Discussion> searchByTitle(@Param("searchTerm") String searchTerm);

    @Query("SELECT d FROM Discussion d JOIN d.participants p WHERE p.id = :memberId ORDER BY d.createdAt DESC")
    List<Discussion> findDiscussionsByParticipant(@Param("memberId") UUID memberId);
}
