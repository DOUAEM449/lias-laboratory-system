package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.entity.Publication;
import com.lias.lias_backend.entity.enums.PublicationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, UUID> {

    List<Publication> findByPubYear(Short year);

    List<Publication> findByPubType(PublicationType type);

    List<Publication> findBySubmittedBy(Member member);

    List<Publication> findByPubYearOrderByPubYearDesc(Short year);

    @Query("SELECT p FROM Publication p WHERE p.pubYear BETWEEN :startYear AND :endYear ORDER BY p.pubYear DESC")
    List<Publication> findPublicationsByYearRange(@Param("startYear") Short startYear, @Param("endYear") Short endYear);

    @Query("SELECT p FROM Publication p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Publication> searchByTitle(@Param("searchTerm") String searchTerm);

    @Query("SELECT p FROM Publication p ORDER BY p.pubYear DESC, p.createdAt DESC")
    List<Publication> findAllOrderByYearDesc();

    Optional<Publication> findByDoi(String doi);

    @Query("SELECT p FROM Publication p WHERE p.doi IS NOT NULL ORDER BY p.createdAt DESC")
    List<Publication> findPublicationsWithDoi();

    @Query("SELECT DISTINCT p.pubYear FROM Publication p ORDER BY p.pubYear DESC")
    List<Short> findDistinctYears();
}
