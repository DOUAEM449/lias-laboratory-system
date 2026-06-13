package com.lias.lias_backend.service;

import com.lias.lias_backend.dto.request.MessageCreateRequest;
import com.lias.lias_backend.dto.request.MessageUpdateRequest;
import com.lias.lias_backend.dto.response.MessageResponse;

import java.util.List;
import java.util.UUID;

public interface MessageService {
    MessageResponse create(MessageCreateRequest request);
    MessageResponse update(UUID id, MessageUpdateRequest request);
    MessageResponse getById(UUID id);
    List<MessageResponse> getAll();
    void delete(UUID id);
}
