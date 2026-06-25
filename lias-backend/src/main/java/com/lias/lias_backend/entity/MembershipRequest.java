package com.lias.lias_backend.entity;


import com.lias.lias_backend.entity.enums.RequestStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;


import java.time.OffsetDateTime;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "membership_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    @NotBlank
    private String firstName;

    @Column(nullable = false, length = 100)
    @NotBlank
    private String lastName;

    @Column(nullable = false)
    @Email
    @NotBlank
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(length = 255)
    private String institution;

    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank
    private String cvUrl;

    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank
    private String motivationLetterUrl;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "request_status")
    private RequestStatus status = RequestStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private Member reviewedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime submittedAt;

    @Column
    private OffsetDateTime reviewedAt;
}