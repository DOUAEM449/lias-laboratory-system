package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Equipment;
import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.entity.enums.EquipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, UUID> {

    List<Equipment> findByStatus(EquipmentStatus status);

    List<Equipment> findByIsAvailable(Boolean isAvailable);

    List<Equipment> findByAssignedTo(Member member);

    Optional<Equipment> findBySerialNumber(String serialNumber);

    @Query("SELECT e FROM Equipment e WHERE e.status = 'AVAILABLE' ORDER BY e.name")
    List<Equipment> findAvailableEquipment();

    @Query("SELECT e FROM Equipment e WHERE e.assignedTo.id = :memberId")
    List<Equipment> findEquipmentAssignedToMember(@Param("memberId") UUID memberId);

    @Query("SELECT e FROM Equipment e WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Equipment> searchByName(@Param("searchTerm") String searchTerm);

    @Query("SELECT e FROM Equipment e WHERE e.status IN ('AVAILABLE', 'ASSIGNED') ORDER BY e.name")
    List<Equipment> findActiveEquipment();

    @Query("SELECT e FROM Equipment e WHERE e.status = 'UNDER_MAINTENANCE' ORDER BY e.name")
    List<Equipment> findEquipmentUnderMaintenance();

    @Query("SELECT COUNT(e) FROM Equipment e WHERE e.status = 'AVAILABLE'")
    Long countAvailableEquipment();
}
