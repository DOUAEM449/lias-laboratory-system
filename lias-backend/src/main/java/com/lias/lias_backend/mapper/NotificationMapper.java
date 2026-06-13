package com.lias.lias_backend.mapper;

import com.lias.lias_backend.dto.request.NotificationCreateRequest;
import com.lias.lias_backend.dto.request.NotificationUpdateRequest;
import com.lias.lias_backend.dto.response.NotificationResponse;
import com.lias.lias_backend.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    Notification toEntity(NotificationCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntity(NotificationUpdateRequest request, @MappingTarget Notification notification);

    @Mapping(source = "member.id", target = "memberId")
    NotificationResponse toResponse(Notification notification);
}
