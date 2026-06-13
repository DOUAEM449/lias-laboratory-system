package com.lias.lias_backend.service;

import com.lias.lias_backend.dto.request.EquipmentRequestCreateRequest;
import com.lias.lias_backend.dto.request.EquipmentRequestUpdateRequest;
import com.lias.lias_backend.dto.response.EquipmentRequestResponse;

import java.util.List;
import java.util.UUID;

public interface EquipmentRequestService {
    EquipmentRequestResponse create(EquipmentRequestCreateRequest request);
    EquipmentRequestResponse update(UUID id, EquipmentRequestUpdateRequest request);
    EquipmentRequestResponse getById(UUID id);
    List<EquipmentRequestResponse> getAll();
    void delete(UUID id);
}
