package com.lias.lias_backend.entity;

import com.lias.lias_backend.entity.enums.PublicationType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.*;

@Entity
@Table(name = "publications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Publication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(columnDefinition = "TEXT", nullable = false)
    @NotBlank
    private String title;

    @Column(nullable = false)
    @Min(1901)
    @Max(2100)
    private Short pubYear;

    @Column(length = 255)
    private String journal;

    @Column(length = 255)
    private String conference;

    @Column(length = 255, unique = true)
    private String doi;

    @Column(columnDefinition = "TEXT")
    private String pdfUrl;

    @Column(name = "abstract", columnDefinition = "TEXT")
    private String abstract_;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PublicationType pubType = PublicationType.JOURNAL_ARTICLE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by")
    private Member submittedBy;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "publication", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<PublicationAuthor> authors = new ArrayList<>();
}
