package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.entity.MembershipRequest;
import com.lias.lias_backend.entity.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MembershipRequestRepository extends JpaRepository<MembershipRequest, UUID> {

    List<MembershipRequest> findByStatus(RequestStatus status);

    Optional<MembershipRequest> findByEmail(String email);

    List<MembershipRequest> findByReviewedBy(Member member);

    List<MembershipRequest> findByMember(Member member);

    @Query("SELECT mr FROM MembershipRequest mr WHERE mr.status = 'PENDING' ORDER BY mr.submittedAt ASC")
    List<MembershipRequest> findPendingRequests();

    @Query("SELECT mr FROM MembershipRequest mr WHERE mr.status IN ('PENDING', 'UNDER_REVIEW') ORDER BY mr.submittedAt ASC")
    List<MembershipRequest> findUnresolvedRequests();

    @Query("SELECT mr FROM MembershipRequest mr WHERE mr.reviewedBy.id = :memberId ORDER BY mr.reviewedAt DESC")
    List<MembershipRequest> findRequestsReviewedByMember(@Param("memberId") UUID memberId);

    @Query("SELECT mr FROM MembershipRequest mr WHERE mr.status = 'APPROVED' AND mr.member.id IS NOT NULL")
    List<MembershipRequest> findApprovedRequests();

    @Query("SELECT COUNT(mr) FROM MembershipRequest mr WHERE mr.status = 'PENDING'")
    Long countPendingRequests();

    @Query("SELECT mr FROM MembershipRequest mr WHERE mr.submittedAt BETWEEN :start AND :end ORDER BY mr.submittedAt DESC")
    List<MembershipRequest> findRequestsInPeriod(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);
}
