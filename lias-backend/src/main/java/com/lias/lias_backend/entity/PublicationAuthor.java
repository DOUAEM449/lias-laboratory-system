package com.lias.lias_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "publication_authors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicationAuthor {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publication_id", nullable = false)
    private Publication publication;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(nullable = false, length = 255)
    @NotBlank
    private String authorName;

    @Column(nullable = false)
    @Positive
    private Short authorOrder;
}
