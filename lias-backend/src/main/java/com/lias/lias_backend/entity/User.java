package com.lias.lias_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // L'agent jme3 firstName o lastName f champ wahed smito "name"
    private String name; 
    
    private String email;
    private String password;
}