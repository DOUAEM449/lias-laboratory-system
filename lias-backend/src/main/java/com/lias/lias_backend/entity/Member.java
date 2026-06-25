/*  👤 PROFILE ONLY */
package com.lias.lias_backend.entity;


import com.lias.lias_backend.entity.enums.MemberStatus;
import jakarta.persistence.*;

import lombok.*;

import java.util.*;

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

    private String phone;

    private String institution;

    private String email;
    
    @Enumerated(EnumType.STRING)
    private MemberStatus status;

    // 🔥 relation with User
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
}