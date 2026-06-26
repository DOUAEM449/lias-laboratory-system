package com.lias.lias_backend.mapper;

import com.lias.lias_backend.dto.request.MemberCreateRequest;
import com.lias.lias_backend.dto.request.MemberUpdateRequest;
import com.lias.lias_backend.dto.response.MemberResponse;
import com.lias.lias_backend.entity.Member;
import org.mapstruct.*;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface MemberMapper {

    // CREATE
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deactivatedAt", ignore = true)
    Member toEntity(MemberCreateRequest request);

    // UPDATE
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deactivatedAt", ignore = true)
    void updateEntity(MemberUpdateRequest request, @MappingTarget Member member);

    // RESPONSE
    MemberResponse toResponse(Member member);
}