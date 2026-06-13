package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.entity.MemberStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface MemberStatusHistoryRepository extends JpaRepository<MemberStatusHistory, UUID> {

    List<MemberStatusHistory> findByMemberOrderByChangedAtDesc(Member member);

    @Query("SELECT msh FROM MemberStatusHistory msh WHERE msh.member.id = :memberId ORDER BY msh.changedAt DESC")
    List<MemberStatusHistory> findMemberStatusHistory(@Param("memberId") UUID memberId);

    @Query("SELECT msh FROM MemberStatusHistory msh WHERE msh.changedAt BETWEEN :start AND :end ORDER BY msh.changedAt DESC")
    List<MemberStatusHistory> findStatusChangesInPeriod(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);

    List<MemberStatusHistory> findByNewStatus(String status);

    @Query("SELECT msh FROM MemberStatusHistory msh WHERE msh.member.id = :memberId ORDER BY msh.changedAt DESC LIMIT 1")
    MemberStatusHistory findLatestStatusChange(@Param("memberId") UUID memberId);
}
