package com.lias.lias_backend.mapper;

import com.lias.lias_backend.dto.request.DiscussionCreateRequest;
import com.lias.lias_backend.dto.request.DiscussionUpdateRequest;
import com.lias.lias_backend.dto.response.DiscussionResponse;
import com.lias.lias_backend.entity.Discussion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DiscussionMapper {

    @Mapping(target = "participants", ignore = true)
    @Mapping(target = "messages", ignore = true)
    Discussion toEntity(DiscussionCreateRequest request);

    @Mapping(target = "participants", ignore = true)
    @Mapping(target = "messages", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntity(DiscussionUpdateRequest request, @MappingTarget Discussion discussion);

    @Mapping(source = "team.id", target = "teamId")
    @Mapping(source = "team.name", target = "teamName")
    @Mapping(source = "event.id", target = "eventId")
    @Mapping(source = "event.title", target = "eventTitle")
    @Mapping(source = "createdBy.id", target = "createdById")
    @Mapping(source = "createdBy.firstName", target = "createdByName")
    @Mapping(target = "participantCount", expression = "java(discussion.getParticipants() != null ? discussion.getParticipants().size() : 0)")
    @Mapping(target = "messageCount", expression = "java(discussion.getMessages() != null ? discussion.getMessages().size() : 0)")
    DiscussionResponse toResponse(Discussion discussion);
}
