package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Convention;
import com.lias.lias_backend.entity.Partner;
import com.lias.lias_backend.entity.enums.ConventionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ConventionRepository extends JpaRepository<Convention, UUID> {

    List<Convention> findByPartner(Partner partner);

    List<Convention> findByStatus(ConventionStatus status);

    @Query("SELECT c FROM Convention c WHERE c.partner.id = :partnerId")
    List<Convention> findConventionsByPartner(@Param("partnerId") UUID partnerId);

    @Query("SELECT c FROM Convention c WHERE c.status = 'ACTIVE'")
    List<Convention> findActiveConventions();

    @Query("SELECT c FROM Convention c WHERE c.startDate <= :date AND (c.endDate IS NULL OR c.endDate >= :date)")
    List<Convention> findValidConventionsAtDate(@Param("date") LocalDate date);

    @Query("SELECT c FROM Convention c WHERE c.startDate BETWEEN :start AND :end ORDER BY c.startDate ASC")
    List<Convention> findConventionsBetweenDates(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT c FROM Convention c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Convention> searchByTitle(@Param("searchTerm") String searchTerm);

    @Query("SELECT c FROM Convention c WHERE c.endDate IS NOT NULL AND c.endDate < :date")
    List<Convention> findExpiredConventions(@Param("date") LocalDate date);

    @Query("SELECT c FROM Convention c WHERE c.status IN ('DRAFT', 'ACTIVE') ORDER BY c.createdAt DESC")
    List<Convention> findCurrentConventions();
}
