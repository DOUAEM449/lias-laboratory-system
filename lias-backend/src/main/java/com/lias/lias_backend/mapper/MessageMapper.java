package com.lias.lias_backend.mapper;

import com.lias.lias_backend.dto.request.MessageCreateRequest;
import com.lias.lias_backend.dto.request.MessageUpdateRequest;
import com.lias.lias_backend.dto.response.MessageResponse;
import com.lias.lias_backend.entity.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    Message toEntity(MessageCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sentAt", ignore = true)
    void updateEntity(MessageUpdateRequest request, @MappingTarget Message message);

    @Mapping(source = "discussion.id", target = "discussionId")
    @Mapping(source = "sender.id", target = "senderId")
    @Mapping(source = "sender.firstName", target = "senderName")
    MessageResponse toResponse(Message message);
}
