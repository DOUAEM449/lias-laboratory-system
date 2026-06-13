package com.lias.lias_backend.service;

import com.lias.lias_backend.dto.request.DiscussionCreateRequest;
import com.lias.lias_backend.dto.request.DiscussionUpdateRequest;
import com.lias.lias_backend.dto.response.DiscussionResponse;

import java.util.List;
import java.util.UUID;

public interface DiscussionService {
    DiscussionResponse create(DiscussionCreateRequest request);
    DiscussionResponse update(UUID id, DiscussionUpdateRequest request);
    DiscussionResponse getById(UUID id);
    List<DiscussionResponse> getAll();
    void delete(UUID id);
}
