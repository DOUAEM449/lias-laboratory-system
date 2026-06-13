package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Partner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PartnerRepository extends JpaRepository<Partner, UUID> {

    Optional<Partner> findByName(String name);

    List<Partner> findByCountry(String country);

    @Query("SELECT p FROM Partner p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Partner> searchByName(@Param("searchTerm") String searchTerm);

    @Query("SELECT p FROM Partner p WHERE LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Partner> searchByDescription(@Param("searchTerm") String searchTerm);

    @Query("SELECT DISTINCT p.country FROM Partner p WHERE p.country IS NOT NULL")
    List<String> findDistinctCountries();

    @Query("SELECT p FROM Partner p ORDER BY p.name ASC")
    List<Partner> findAllOrderedByName();
}
