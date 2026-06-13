package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.entity.enums.MemberStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MemberRepository extends JpaRepository<Member, UUID> {

    Optional<Member> findByEmail(String email);

    List<Member> findByStatus(MemberStatus status);

    List<Member> findByIsActive(Boolean isActive);

    List<Member> findByStatusAndIsActive(MemberStatus status, Boolean isActive);

    List<Member> findByLastNameIgnoreCase(String lastName);

    List<Member> findByFirstNameIgnoreCaseOrLastNameIgnoreCase(String firstName, String lastName);

    @Query("SELECT m FROM Member m WHERE LOWER(m.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(m.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Member> searchByName(@Param("searchTerm") String searchTerm);

    @Query("SELECT m FROM Member m WHERE m.isActive = true AND m.status IN ('PERMANENT', 'ASSOCIATED', 'PHD')")
    List<Member> findActiveMembers();

    @Query("SELECT m FROM Member m WHERE m.status = 'RETIRED' OR m.status = 'FORMER'")
    List<Member> findInactiveMembers();
}
