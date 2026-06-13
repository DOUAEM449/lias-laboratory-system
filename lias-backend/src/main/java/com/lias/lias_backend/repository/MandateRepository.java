package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Mandate;
import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.entity.Role;
import com.lias.lias_backend.entity.Team;
import com.lias.lias_backend.entity.enums.MandateScope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MandateRepository extends JpaRepository<Mandate, UUID> {

    List<Mandate> findByMember(Member member);

    List<Mandate> findByRole(Role role);

    List<Mandate> findByTeam(Team team);

    List<Mandate> findByMemberAndIsCurrent(Member member, Boolean isCurrent);

    List<Mandate> findByRoleAndIsCurrent(Role role, Boolean isCurrent);

    List<Mandate> findByScope(MandateScope scope);

    @Query("SELECT m FROM Mandate m WHERE m.member.id = :memberId AND m.isCurrent = true")
    List<Mandate> findCurrentMandatesByMember(@Param("memberId") UUID memberId);

    @Query("SELECT m FROM Mandate m WHERE m.role.id = :roleId AND m.scope = 'LABORATORY' AND m.isCurrent = true")
    Optional<Mandate> findCurrentLabWideMandate(@Param("roleId") UUID roleId);

    @Query("SELECT m FROM Mandate m WHERE m.role.id = :roleId AND m.team.id = :teamId AND m.isCurrent = true")
    Optional<Mandate> findCurrentTeamMandate(@Param("roleId") UUID roleId, @Param("teamId") UUID teamId);

    @Query("SELECT m FROM Mandate m WHERE m.startDate <= :date AND (m.endDate IS NULL OR m.endDate >= :date)")
    List<Mandate> findMandatesAtDate(@Param("date") LocalDate date);

    @Query("SELECT m FROM Mandate m WHERE m.member.id = :memberId AND m.role.id = :roleId AND m.isCurrent = true")
    Optional<Mandate> findCurrentMandateByMemberAndRole(@Param("memberId") UUID memberId, @Param("roleId") UUID roleId);
}
