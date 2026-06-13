package com.lias.lias_backend.entity;

import com.lias.lias_backend.entity.enums.DocumentType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.*;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 255)
    @NotBlank
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType docType = DocumentType.ADMINISTRATIVE;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank
    private String fileUrl;

    @Column(nullable = false)
    @Positive
    private Short version = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_doc_id")
    private Document parentDoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private Member uploadedBy;

    @Column(nullable = false)
    private Boolean isArchived = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @OneToMany(mappedBy = "parentDoc", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Document> versions = new ArrayList<>();

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Convention> conventions = new ArrayList<>();

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<AnnualReport> annualReports = new ArrayList<>();
}
