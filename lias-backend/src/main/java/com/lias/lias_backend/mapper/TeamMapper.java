package com.lias.lias_backend.mapper;

import com.lias.lias_backend.dto.request.TeamCreateRequest;
import com.lias.lias_backend.dto.request.TeamUpdateRequest;
import com.lias.lias_backend.dto.response.TeamResponse;
import com.lias.lias_backend.entity.Team;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TeamMapper {

    @Mapping(target = "memberAffiliations", ignore = true)
    @Mapping(target = "mandates", ignore = true)
    @Mapping(target = "documents", ignore = true)
    @Mapping(target = "meetings", ignore = true)
    @Mapping(target = "discussions", ignore = true)
    Team toEntity(TeamCreateRequest request);

    @Mapping(target = "memberAffiliations", ignore = true)
    @Mapping(target = "mandates", ignore = true)
    @Mapping(target = "documents", ignore = true)
    @Mapping(target = "meetings", ignore = true)
    @Mapping(target = "discussions", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(TeamUpdateRequest request, @MappingTarget Team team);

    @Mapping(source = "leader.id", target = "leaderId")
    @Mapping(source = "leader.firstName", target = "leaderName")
    TeamResponse toResponse(Team team);
}
