package com.lias.lias_backend.service;

import com.lias.lias_backend.dto.request.PartnerCreateRequest;
import com.lias.lias_backend.dto.request.PartnerUpdateRequest;
import com.lias.lias_backend.dto.response.PartnerResponse;

import java.util.List;
import java.util.UUID;

public interface PartnerService {
    PartnerResponse create(PartnerCreateRequest request);
    PartnerResponse update(UUID id, PartnerUpdateRequest request);
    PartnerResponse getById(UUID id);
    List<PartnerResponse> getAll();
    void delete(UUID id);
}
