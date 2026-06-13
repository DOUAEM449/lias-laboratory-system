package com.lias.lias_backend.service;

import com.lias.lias_backend.dto.request.ConventionCreateRequest;
import com.lias.lias_backend.dto.request.ConventionUpdateRequest;
import com.lias.lias_backend.dto.response.ConventionResponse;

import java.util.List;
import java.util.UUID;

public interface ConventionService {
    ConventionResponse create(ConventionCreateRequest request);
    ConventionResponse update(UUID id, ConventionUpdateRequest request);
    ConventionResponse getById(UUID id);
    List<ConventionResponse> getAll();
    void delete(UUID id);
}
