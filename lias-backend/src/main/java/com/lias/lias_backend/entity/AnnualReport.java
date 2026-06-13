package com.lias.lias_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "annual_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnualReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    @Min(1901)
    @Max(2100)
    private Short reportYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private Document document;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generated_by")
    private Member generatedBy;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime generatedAt;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
