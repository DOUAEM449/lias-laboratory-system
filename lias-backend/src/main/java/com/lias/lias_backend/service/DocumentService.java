package com.lias.lias_backend.service;

import com.lias.lias_backend.dto.request.DocumentCreateRequest;
import com.lias.lias_backend.dto.request.DocumentUpdateRequest;
import com.lias.lias_backend.dto.response.DocumentResponse;

import java.util.List;
import java.util.UUID;

public interface DocumentService {
    DocumentResponse create(DocumentCreateRequest request);
    DocumentResponse update(UUID id, DocumentUpdateRequest request);
    DocumentResponse getById(UUID id);
    List<DocumentResponse> getAll();
    void delete(UUID id);
}
