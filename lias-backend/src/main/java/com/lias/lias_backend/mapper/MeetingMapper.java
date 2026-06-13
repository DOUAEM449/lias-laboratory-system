package com.lias.lias_backend.mapper;

import com.lias.lias_backend.dto.request.MeetingCreateRequest;
import com.lias.lias_backend.dto.request.MeetingUpdateRequest;
import com.lias.lias_backend.dto.response.MeetingResponse;
import com.lias.lias_backend.entity.Meeting;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MeetingMapper {

    @Mapping(target = "attendees", ignore = true)
    Meeting toEntity(MeetingCreateRequest request);

    @Mapping(target = "attendees", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(MeetingUpdateRequest request, @MappingTarget Meeting meeting);

    @Mapping(source = "team.id", target = "teamId")
    @Mapping(source = "team.name", target = "teamName")
    @Mapping(source = "createdBy.id", target = "createdById")
    @Mapping(source = "createdBy.firstName", target = "createdByName")
    MeetingResponse toResponse(Meeting meeting);
}
