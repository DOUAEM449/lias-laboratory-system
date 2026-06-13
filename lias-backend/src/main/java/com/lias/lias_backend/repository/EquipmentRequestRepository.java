package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Equipment;
import com.lias.lias_backend.entity.EquipmentRequest;
import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.entity.enums.EquipmentRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EquipmentRequestRepository extends JpaRepository<EquipmentRequest, UUID> {

    List<EquipmentRequest> findByMember(Member member);

    List<EquipmentRequest> findByStatus(EquipmentRequestStatus status);

    List<EquipmentRequest> findByEquipment(Equipment equipment);

    @Query("SELECT er FROM EquipmentRequest er WHERE er.member.id = :memberId ORDER BY er.createdAt DESC")
    List<EquipmentRequest> findMemberRequests(@Param("memberId") UUID memberId);

    @Query("SELECT er FROM EquipmentRequest er WHERE er.status = 'PENDING' ORDER BY er.createdAt ASC")
    List<EquipmentRequest> findPendingRequests();

    @Query("SELECT er FROM EquipmentRequest er WHERE er.status IN ('PENDING', 'APPROVED') ORDER BY er.createdAt ASC")
    List<EquipmentRequest> findActiveRequests();

    @Query("SELECT er FROM EquipmentRequest er WHERE er.equipment.id = :equipmentId ORDER BY er.createdAt DESC")
    List<EquipmentRequest> findRequestsForEquipment(@Param("equipmentId") UUID equipmentId);

    @Query("SELECT COUNT(er) FROM EquipmentRequest er WHERE er.status = 'PENDING'")
    Long countPendingRequests();

    @Query("SELECT er FROM EquipmentRequest er WHERE er.member.id = :memberId AND er.status = 'PENDING'")
    List<EquipmentRequest> findMemberPendingRequests(@Param("memberId") UUID memberId);
}
