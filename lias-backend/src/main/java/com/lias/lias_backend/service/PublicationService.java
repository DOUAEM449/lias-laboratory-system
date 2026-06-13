package com.lias.lias_backend.service;

import com.lias.lias_backend.dto.request.PublicationCreateRequest;
import com.lias.lias_backend.dto.request.PublicationUpdateRequest;
import com.lias.lias_backend.dto.response.PublicationResponse;

import java.util.List;
import java.util.UUID;

public interface PublicationService {
    PublicationResponse create(PublicationCreateRequest request);
    PublicationResponse update(UUID id, PublicationUpdateRequest request);
    PublicationResponse getById(UUID id);
    List<PublicationResponse> getAll();
    void delete(UUID id);
}
