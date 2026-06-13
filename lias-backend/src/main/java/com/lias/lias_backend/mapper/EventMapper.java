package com.lias.lias_backend.mapper;

import com.lias.lias_backend.dto.request.EventCreateRequest;
import com.lias.lias_backend.dto.request.EventUpdateRequest;
import com.lias.lias_backend.dto.response.EventResponse;
import com.lias.lias_backend.entity.Event;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EventMapper {

    @Mapping(target = "childEvents", ignore = true)
    @Mapping(target = "documents", ignore = true)
    @Mapping(target = "participants", ignore = true)
    @Mapping(target = "discussions", ignore = true)
    Event toEntity(EventCreateRequest request);

    @Mapping(target = "childEvents", ignore = true)
    @Mapping(target = "documents", ignore = true)
    @Mapping(target = "participants", ignore = true)
    @Mapping(target = "discussions", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(EventUpdateRequest request, @MappingTarget Event event);

    @Mapping(source = "createdBy.id", target = "createdById")
    @Mapping(source = "createdBy.firstName", target = "createdByName")
    EventResponse toResponse(Event event);
}
