package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {

    Optional<Role> findByName(String name);

    List<Role> findByPermissionLevelGreaterThanEqual(Short permissionLevel);

    List<Role> findByPermissionLevelLessThan(Short permissionLevel);

    @Query("SELECT r FROM Role r ORDER BY r.permissionLevel DESC")
    List<Role> findAllByPermissionLevelDescending();

    @Query("SELECT r FROM Role r WHERE r.permissionLevel >= :level")
    List<Role> findRolesWithMinPermission(@Param("level") Short level);
}
