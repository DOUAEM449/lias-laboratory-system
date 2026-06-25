package com.lias.lias_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    @NotBlank
    @Size(max = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Min(0)
    @Max(100)
    private Short permissionLevel = 0;

    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Mandate> mandates = new ArrayList<>();
}
