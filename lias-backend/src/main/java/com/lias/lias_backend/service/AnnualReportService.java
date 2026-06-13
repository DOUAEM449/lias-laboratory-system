package com.lias.lias_backend.service;

import com.lias.lias_backend.dto.request.AnnualReportCreateRequest;
import com.lias.lias_backend.dto.request.AnnualReportUpdateRequest;
import com.lias.lias_backend.dto.response.AnnualReportResponse;

import java.util.List;
import java.util.UUID;

public interface AnnualReportService {
    AnnualReportResponse create(AnnualReportCreateRequest request);
    AnnualReportResponse update(UUID id, AnnualReportUpdateRequest request);
    AnnualReportResponse getById(UUID id);
    List<AnnualReportResponse> getAll();
    void delete(UUID id);
}
