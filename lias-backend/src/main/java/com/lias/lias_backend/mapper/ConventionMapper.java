package com.lias.lias_backend.mapper;

import com.lias.lias_backend.dto.request.ConventionCreateRequest;
import com.lias.lias_backend.dto.request.ConventionUpdateRequest;
import com.lias.lias_backend.dto.response.ConventionResponse;
import com.lias.lias_backend.entity.Convention;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ConventionMapper {

    Convention toEntity(ConventionCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(ConventionUpdateRequest request, @MappingTarget Convention convention);

    @Mapping(source = "partner.id", target = "partnerId")
    @Mapping(source = "partner.name", target = "partnerName")
    @Mapping(source = "document.id", target = "documentId")
    @Mapping(source = "createdBy.id", target = "createdById")
    @Mapping(source = "createdBy.firstName", target = "createdByName")
    ConventionResponse toResponse(Convention convention);
}
