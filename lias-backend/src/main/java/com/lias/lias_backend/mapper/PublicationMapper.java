package com.lias.lias_backend.mapper;

import com.lias.lias_backend.dto.request.PublicationCreateRequest;
import com.lias.lias_backend.dto.request.PublicationUpdateRequest;
import com.lias.lias_backend.dto.response.PublicationResponse;
import com.lias.lias_backend.entity.Publication;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PublicationMapper {

    @Mapping(target = "authors", ignore = true)
    Publication toEntity(PublicationCreateRequest request);

    @Mapping(target = "authors", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(PublicationUpdateRequest request, @MappingTarget Publication publication);

    @Mapping(source = "submittedBy.id", target = "submittedById")
    @Mapping(source = "submittedBy.firstName", target = "submittedByName")
    PublicationResponse toResponse(Publication publication);
}
