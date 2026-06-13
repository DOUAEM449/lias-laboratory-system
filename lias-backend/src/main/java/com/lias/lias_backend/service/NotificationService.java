package com.lias.lias_backend.service;

import com.lias.lias_backend.dto.request.NotificationCreateRequest;
import com.lias.lias_backend.dto.request.NotificationUpdateRequest;
import com.lias.lias_backend.dto.response.NotificationResponse;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    NotificationResponse create(NotificationCreateRequest request);
    NotificationResponse update(UUID id, NotificationUpdateRequest request);
    NotificationResponse getById(UUID id);
    List<NotificationResponse> getAll();
    void delete(UUID id);
}
