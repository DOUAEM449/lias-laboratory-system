package com.lias.lias_backend.service;

import com.lias.lias_backend.dto.request.EventCreateRequest;
import com.lias.lias_backend.dto.request.EventUpdateRequest;
import com.lias.lias_backend.dto.response.EventResponse;

import java.util.List;
import java.util.UUID;

public interface EventService {
    EventResponse create(EventCreateRequest request);
    EventResponse update(UUID id, EventUpdateRequest request);
    EventResponse getById(UUID id);
    List<EventResponse> getAll();
    void delete(UUID id);
}
