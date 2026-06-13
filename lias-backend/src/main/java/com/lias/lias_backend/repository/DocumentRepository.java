package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Document;
import com.lias.lias_backend.entity.Event;
import com.lias.lias_backend.entity.Team;
import com.lias.lias_backend.entity.enums.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {

    List<Document> findByDocType(DocumentType docType);

    List<Document> findByTeam(Team team);

    List<Document> findByEvent(Event event);

    List<Document> findByIsArchived(Boolean isArchived);

    @Query("SELECT d FROM Document d WHERE d.parentDoc.id = :parentDocId ORDER BY d.version DESC")
    List<Document> findDocumentVersions(@Param("parentDocId") UUID parentDocId);

    @Query("SELECT d FROM Document d WHERE d.parentDoc IS NULL")
    List<Document> findRootDocuments();

    @Query("SELECT d FROM Document d WHERE LOWER(d.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Document> searchByTitle(@Param("searchTerm") String searchTerm);

    @Query("SELECT d FROM Document d WHERE d.team.id = :teamId AND d.isArchived = false ORDER BY d.createdAt DESC")
    List<Document> findTeamDocuments(@Param("teamId") UUID teamId);

    @Query("SELECT d FROM Document d WHERE d.docType = 'ANNUAL_REPORT' ORDER BY d.createdAt DESC")
    List<Document> findAnnualReportDocuments();

    @Query("SELECT d FROM Document d WHERE d.event.id = :eventId ORDER BY d.createdAt DESC")
    List<Document> findEventDocuments(@Param("eventId") UUID eventId);
}
