package com.lias.lias_backend.service;

import com.lias.lias_backend.dto.request.EquipmentCreateRequest;
import com.lias.lias_backend.dto.request.EquipmentUpdateRequest;
import com.lias.lias_backend.dto.response.EquipmentResponse;

import java.util.List;
import java.util.UUID;

public interface EquipmentService {
    EquipmentResponse create(EquipmentCreateRequest request);
    EquipmentResponse update(UUID id, EquipmentUpdateRequest request);
    EquipmentResponse getById(UUID id);
    List<EquipmentResponse> getAll();
    void delete(UUID id);
}
