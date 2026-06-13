package com.lias.lias_backend.mapper;

import com.lias.lias_backend.dto.request.EquipmentRequestCreateRequest;
import com.lias.lias_backend.dto.request.EquipmentRequestUpdateRequest;
import com.lias.lias_backend.dto.response.EquipmentRequestResponse;
import com.lias.lias_backend.entity.EquipmentRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EquipmentRequestMapper {

    EquipmentRequest toEntity(EquipmentRequestCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(EquipmentRequestUpdateRequest request, @MappingTarget EquipmentRequest equipmentRequest);

    @Mapping(source = "member.id", target = "memberId")
    @Mapping(source = "member.firstName", target = "memberName")
    @Mapping(source = "equipment.id", target = "equipmentId")
    @Mapping(source = "equipment.name", target = "equipmentName")
    @Mapping(source = "reviewedBy.id", target = "reviewedById")
    @Mapping(source = "reviewedBy.firstName", target = "reviewedByName")
    EquipmentRequestResponse toResponse(EquipmentRequest equipmentRequest);
}
