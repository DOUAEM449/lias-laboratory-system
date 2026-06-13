package com.lias.lias_backend.mapper;

import com.lias.lias_backend.dto.request.AnnualReportCreateRequest;
import com.lias.lias_backend.dto.request.AnnualReportUpdateRequest;
import com.lias.lias_backend.dto.response.AnnualReportResponse;
import com.lias.lias_backend.entity.AnnualReport;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AnnualReportMapper {

    AnnualReport toEntity(AnnualReportCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "generatedAt", ignore = true)
    void updateEntity(AnnualReportUpdateRequest request, @MappingTarget AnnualReport annualReport);

    @Mapping(source = "document.id", target = "documentId")
    @Mapping(source = "document.title", target = "documentTitle")
    @Mapping(source = "generatedBy.id", target = "generatedById")
    @Mapping(source = "generatedBy.firstName", target = "generatedByName")
    AnnualReportResponse toResponse(AnnualReport annualReport);
}
