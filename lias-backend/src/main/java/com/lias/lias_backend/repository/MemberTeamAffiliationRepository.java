package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.entity.MemberTeamAffiliation;
import com.lias.lias_backend.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MemberTeamAffiliationRepository extends JpaRepository<MemberTeamAffiliation, UUID> {

    List<MemberTeamAffiliation> findByMember(Member member);

    List<MemberTeamAffiliation> findByTeam(Team team);

    List<MemberTeamAffiliation> findByMemberAndTeam(Member member, Team team);

    List<MemberTeamAffiliation> findByMemberAndIsCurrent(Member member, Boolean isCurrent);

    List<MemberTeamAffiliation> findByTeamAndIsCurrent(Team team, Boolean isCurrent);

    @Query("SELECT mta FROM MemberTeamAffiliation mta WHERE mta.member.id = :memberId AND mta.isCurrent = true")
    List<MemberTeamAffiliation> findCurrentAffiliationsByMember(@Param("memberId") UUID memberId);

    @Query("SELECT mta FROM MemberTeamAffiliation mta WHERE mta.team.id = :teamId AND mta.isCurrent = true")
    List<MemberTeamAffiliation> findCurrentMembersByTeam(@Param("teamId") UUID teamId);

    @Query("SELECT mta FROM MemberTeamAffiliation mta WHERE mta.member.id = :memberId AND mta.team.id = :teamId AND mta.isCurrent = true")
    Optional<MemberTeamAffiliation> findCurrentAffiliation(@Param("memberId") UUID memberId, @Param("teamId") UUID teamId);

    @Query("SELECT mta FROM MemberTeamAffiliation mta WHERE mta.startDate <= :date AND (mta.endDate IS NULL OR mta.endDate >= :date)")
    List<MemberTeamAffiliation> findAffiliationsAtDate(@Param("date") LocalDate date);
}
