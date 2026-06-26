/*  👤 PROFILE ONLY */
package com.lias.lias_backend.entity;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.lias.lias_backend.converter.MemberStatusConverter;
import com.lias.lias_backend.entity.enums.MemberStatus;
import jakarta.persistence.*;

import lombok.*;



@Entity
@Table(name = "members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true)
    private String email;

    private String phone;

    private String institution;

    @Column(length = 3000)
    private String bio;

    private String photoUrl;

    private LocalDate birthdate;

    private LocalDate hireDate;

    private String originLab;

    // @ElementCollection
    // @CollectionTable(
    //     name = "member_interests",
    //     joinColumns = @JoinColumn(name = "member_id")
    // )
    // @Column(name = "interest")
    // private List<String> interests;

   @Enumerated(EnumType.STRING)
@Column(nullable = false)
private MemberStatus status;
    @Builder.Default
    private Boolean isActive = true;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    private OffsetDateTime deactivatedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    public void onCreate() {
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    @Column(name = "password_hash", nullable = false)
private String passwordHash;
}