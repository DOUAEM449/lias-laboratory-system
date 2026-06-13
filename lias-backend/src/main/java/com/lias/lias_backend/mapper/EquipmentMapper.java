package com.lias.lias_backend.mapper;

import com.lias.lias_backend.dto.request.EquipmentCreateRequest;
import com.lias.lias_backend.dto.request.EquipmentUpdateRequest;
import com.lias.lias_backend.dto.response.EquipmentResponse;
import com.lias.lias_backend.entity.Equipment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EquipmentMapper {

    @Mapping(target = "assignments", ignore = true)
    @Mapping(target = "requests", ignore = true)
    Equipment toEntity(EquipmentCreateRequest request);

    @Mapping(target = "assignments", ignore = true)
    @Mapping(target = "requests", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(EquipmentUpdateRequest request, @MappingTarget Equipment equipment);

    @Mapping(source = "assignedTo.id", target = "assignedToId")
    @Mapping(source = "assignedTo.firstName", target = "assignedToName")
    EquipmentResponse toResponse(Equipment equipment);
}
