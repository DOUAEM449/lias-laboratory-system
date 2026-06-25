package com.lias.lias_backend.mapper;

import com.lias.lias_backend.dto.request.MemberCreateRequest;
import com.lias.lias_backend.dto.request.MemberUpdateRequest;
import com.lias.lias_backend.dto.response.MemberResponse;
import com.lias.lias_backend.entity.Member;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MemberMapper {

    // CREATE
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    Member toEntity(MemberCreateRequest request);

    // UPDATE
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateEntity(MemberUpdateRequest request, @MappingTarget Member member);

    // RESPONSE
    MemberResponse toResponse(Member member);
}