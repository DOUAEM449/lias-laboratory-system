package com.lias.lias_backend.mapper;

import com.lias.lias_backend.dto.request.DocumentCreateRequest;
import com.lias.lias_backend.dto.request.DocumentUpdateRequest;
import com.lias.lias_backend.dto.response.DocumentResponse;
import com.lias.lias_backend.entity.Document;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DocumentMapper {

    @Mapping(target = "versions", ignore = true)
    @Mapping(target = "conventions", ignore = true)
    @Mapping(target = "annualReports", ignore = true)
    Document toEntity(DocumentCreateRequest request);

    @Mapping(target = "versions", ignore = true)
    @Mapping(target = "conventions", ignore = true)
    @Mapping(target = "annualReports", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntity(DocumentUpdateRequest request, @MappingTarget Document document);

    @Mapping(source = "team.id", target = "teamId")
    @Mapping(source = "team.name", target = "teamName")
    @Mapping(source = "event.id", target = "eventId")
    @Mapping(source = "event.title", target = "eventTitle")
    @Mapping(source = "uploadedBy.id", target = "uploadedById")
    @Mapping(source = "uploadedBy.firstName", target = "uploadedByName")
    DocumentResponse toResponse(Document document);
}
