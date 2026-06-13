package com.lias.lias_backend.mapper;

import com.lias.lias_backend.dto.request.MembershipRequestCreateRequest;
import com.lias.lias_backend.dto.request.MembershipRequestUpdateRequest;
import com.lias.lias_backend.dto.response.MembershipRequestResponse;
import com.lias.lias_backend.entity.MembershipRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MembershipRequestMapper {

    MembershipRequest toEntity(MembershipRequestCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "submittedAt", ignore = true)
    void updateEntity(MembershipRequestUpdateRequest request, @MappingTarget MembershipRequest membershipRequest);

    @Mapping(source = "reviewedBy.id", target = "reviewedById")
    @Mapping(source = "reviewedBy.firstName", target = "reviewedByName")
    MembershipRequestResponse toResponse(MembershipRequest membershipRequest);
}
