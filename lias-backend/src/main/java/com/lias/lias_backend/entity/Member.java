package com.lias.lias_backend.entity;

import com.lias.lias_backend.entity.enums.MemberStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;
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

    @Column(nullable = false, unique = true)
    @Email
    @NotBlank
    private String email;

    @Column(nullable = false)
    @NotBlank
    private String passwordHash;

    @Column(nullable = false)
    @NotBlank
    @Size(max = 100)
    private String firstName;

    @Column(nullable = false)
    @NotBlank
    @Size(max = 100)
    private String lastName;

    @Column(length = 30)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(columnDefinition = "TEXT")
    private String photoUrl;

    @Column
    private LocalDate birthdate;

    @Column
    private LocalDate hireDate;

    @Column(length = 255)
    private String institution;

    @Column(length = 255)
    private String originLab;

    @Column(columnDefinition = "TEXT[]")
    private String[] interests;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberStatus status = MemberStatus.PERMANENT;

    @Column(nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private OffsetDateTime updatedAt;

    @Column
    private OffsetDateTime deactivatedAt;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<MemberStatusHistory> statusHistories = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<MemberTeamAffiliation> teamAffiliations = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Mandate> mandates = new ArrayList<>();

    @OneToMany(mappedBy = "changedBy", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<MemberStatusHistory> changedHistories = new ArrayList<>();

    @OneToMany(mappedBy = "leader", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Team> leaderTeams = new ArrayList<>();

    @OneToMany(mappedBy = "submittedBy", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Publication> publications = new ArrayList<>();

    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Event> createdEvents = new ArrayList<>();

    @OneToMany(mappedBy = "uploadedBy", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Document> uploadedDocuments = new ArrayList<>();

    @OneToMany(mappedBy = "assignedTo", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Equipment> assignedEquipments = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<EquipmentAssignment> equipmentAssignments = new ArrayList<>();

    @OneToMany(mappedBy = "assignedBy", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<EquipmentAssignment> approvedAssignments = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<EquipmentRequest> equipmentRequests = new ArrayList<>();

    @OneToMany(mappedBy = "reviewedBy", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<EquipmentRequest> reviewedEquipmentRequests = new ArrayList<>();

    @OneToMany(mappedBy = "reviewedBy", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<MembershipRequest> reviewedMembershipRequests = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<MembershipRequest> membershipRequests = new ArrayList<>();

    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Meeting> createdMeetings = new ArrayList<>();

    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Convention> createdConventions = new ArrayList<>();

    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Discussion> createdDiscussions = new ArrayList<>();

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Message> sentMessages = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Notification> notifications = new ArrayList<>();

    @OneToMany(mappedBy = "generatedBy", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<AnnualReport> generatedReports = new ArrayList<>();

    @ManyToMany(mappedBy = "participants")
    @ToString.Exclude
    private List<Event> participatedEvents = new ArrayList<>();

    @ManyToMany(mappedBy = "attendees")
    @ToString.Exclude
    private List<Meeting> attendedMeetings = new ArrayList<>();

    @ManyToMany(mappedBy = "participants")
    @ToString.Exclude
    private List<Discussion> discussions = new ArrayList<>();

   
}
