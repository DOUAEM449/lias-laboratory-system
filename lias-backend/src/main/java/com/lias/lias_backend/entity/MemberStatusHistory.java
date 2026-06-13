package com.lias.lias_backend.entity;

import com.lias.lias_backend.entity.enums.MemberStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "member_status_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Enumerated(EnumType.STRING)
    @Column
    private MemberStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberStatus newStatus;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by")
    private Member changedBy;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime changedAt;
}
