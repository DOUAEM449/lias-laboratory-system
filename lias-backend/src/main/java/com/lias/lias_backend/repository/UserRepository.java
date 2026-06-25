package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional; // <--- T2aked mn had l'import

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email); // <--- Khas tkon Optional
}