package com.lias.lias_backend.mapper;

import com.lias.lias_backend.dto.request.PartnerCreateRequest;
import com.lias.lias_backend.dto.request.PartnerUpdateRequest;
import com.lias.lias_backend.dto.response.PartnerResponse;
import com.lias.lias_backend.entity.Partner;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PartnerMapper {

    @Mapping(target = "conventions", ignore = true)
    Partner toEntity(PartnerCreateRequest request);

    @Mapping(target = "conventions", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntity(PartnerUpdateRequest request, @MappingTarget Partner partner);

    PartnerResponse toResponse(Partner partner);
}
