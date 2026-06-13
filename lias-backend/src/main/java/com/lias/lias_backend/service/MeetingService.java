package com.lias.lias_backend.service;

import com.lias.lias_backend.dto.request.MeetingCreateRequest;
import com.lias.lias_backend.dto.request.MeetingUpdateRequest;
import com.lias.lias_backend.dto.response.MeetingResponse;

import java.util.List;
import java.util.UUID;

public interface MeetingService {
    MeetingResponse create(MeetingCreateRequest request);
    MeetingResponse update(UUID id, MeetingUpdateRequest request);
    MeetingResponse getById(UUID id);
    List<MeetingResponse> getAll();
    void delete(UUID id);
}
