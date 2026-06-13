package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.AnnualReport;
import com.lias.lias_backend.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AnnualReportRepository extends JpaRepository<AnnualReport, UUID> {

    Optional<AnnualReport> findByReportYear(Short year);

    List<AnnualReport> findByGeneratedBy(Member member);

    @Query("SELECT ar FROM AnnualReport ar ORDER BY ar.reportYear DESC")
    List<AnnualReport> findAllOrderedByYear();

    @Query("SELECT ar FROM AnnualReport ar WHERE ar.reportYear >= :startYear AND ar.reportYear <= :endYear ORDER BY ar.reportYear DESC")
    List<AnnualReport> findReportsByYearRange(@Param("startYear") Short startYear, @Param("endYear") Short endYear);

    @Query("SELECT ar FROM AnnualReport ar WHERE ar.document.id IS NOT NULL ORDER BY ar.reportYear DESC")
    List<AnnualReport> findReportsWithDocuments();

    @Query("SELECT ar FROM AnnualReport ar WHERE ar.document.id IS NULL")
    List<AnnualReport> findReportsPendingDocuments();

    @Query("SELECT DISTINCT ar.reportYear FROM AnnualReport ar ORDER BY ar.reportYear DESC")
    List<Short> findAllReportYears();

    @Query("SELECT COUNT(ar) FROM AnnualReport ar")
    Long countTotalReports();
}
