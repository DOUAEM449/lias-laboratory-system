package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeamRepository extends JpaRepository<Team, UUID> {

    Optional<Team> findByName(String name);

    List<Team> findByIsActive(Boolean isActive);

    List<Team> findByIsActiveOrderByName(Boolean isActive);

    @Query("SELECT t FROM Team t WHERE t.isActive = true ORDER BY t.name")
    List<Team> findActiveTeamsOrderedByName();

    @Query("SELECT t FROM Team t WHERE t.leader.id = :leaderId")
    List<Team> findTeamsByLeader(@Param("leaderId") UUID leaderId);

    @Query("SELECT t FROM Team t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Team> searchByName(@Param("searchTerm") String searchTerm);
}
