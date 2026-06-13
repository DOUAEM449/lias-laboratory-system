package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Equipment;
import com.lias.lias_backend.entity.EquipmentAssignment;
import com.lias.lias_backend.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EquipmentAssignmentRepository extends JpaRepository<EquipmentAssignment, UUID> {

    List<EquipmentAssignment> findByEquipment(Equipment equipment);

    List<EquipmentAssignment> findByMember(Member member);

    @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.equipment.id = :equipmentId AND ea.returnedAt IS NULL")
    Optional<EquipmentAssignment> findActiveAssignment(@Param("equipmentId") UUID equipmentId);

    @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.member.id = :memberId AND ea.returnedAt IS NULL")
    List<EquipmentAssignment> findActiveAssignmentsByMember(@Param("memberId") UUID memberId);

    @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.returnedAt IS NULL ORDER BY ea.assignedAt DESC")
    List<EquipmentAssignment> findAllActiveAssignments();

    @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.equipment.id = :equipmentId ORDER BY ea.assignedAt DESC")
    List<EquipmentAssignment> findAssignmentHistoryByEquipment(@Param("equipmentId") UUID equipmentId);

    @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.member.id = :memberId ORDER BY ea.assignedAt DESC")
    List<EquipmentAssignment> findAssignmentHistoryByMember(@Param("memberId") UUID memberId);

    @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.assignedAt BETWEEN :start AND :end")
    List<EquipmentAssignment> findAssignmentsBetweenDates(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);
}
