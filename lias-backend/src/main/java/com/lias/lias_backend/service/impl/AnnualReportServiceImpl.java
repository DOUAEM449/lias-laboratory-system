package com.lias.lias_backend.service.impl;

import com.lias.lias_backend.dto.request.AnnualReportCreateRequest;
import com.lias.lias_backend.dto.request.AnnualReportUpdateRequest;
import com.lias.lias_backend.dto.response.AnnualReportResponse;
import com.lias.lias_backend.entity.AnnualReport;
import com.lias.lias_backend.entity.Document;
import com.lias.lias_backend.exception.ResourceNotFoundException;
import com.lias.lias_backend.mapper.AnnualReportMapper;
import com.lias.lias_backend.repository.AnnualReportRepository;
import com.lias.lias_backend.repository.DocumentRepository;
import com.lias.lias_backend.service.AnnualReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class AnnualReportServiceImpl implements AnnualReportService {

    private final AnnualReportRepository annualReportRepository;
    private final DocumentRepository documentRepository;
    private final AnnualReportMapper annualReportMapper;

    public AnnualReportServiceImpl(AnnualReportRepository annualReportRepository,
                                    DocumentRepository documentRepository,
                                    AnnualReportMapper annualReportMapper) {
        this.annualReportRepository = annualReportRepository;
        this.documentRepository = documentRepository;
        this.annualReportMapper = annualReportMapper;
    }

    @Override
    public AnnualReportResponse create(AnnualReportCreateRequest request) {
        AnnualReport annualReport = annualReportMapper.toEntity(request);
        if (request.getDocumentId() != null) {
            Document document = documentRepository.findById(request.getDocumentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Document", "id", request.getDocumentId()));
            annualReport.setDocument(document);
        }
        AnnualReport saved = annualReportRepository.save(annualReport);
        return annualReportMapper.toResponse(saved);
    }

    @Override
    public AnnualReportResponse update(UUID id, AnnualReportUpdateRequest request) {
        AnnualReport annualReport = annualReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AnnualReport", "id", id));
        annualReportMapper.updateEntity(request, annualReport);
        if (request.getDocumentId() != null) {
            Document document = documentRepository.findById(request.getDocumentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Document", "id", request.getDocumentId()));
            annualReport.setDocument(document);
        }
        AnnualReport saved = annualReportRepository.save(annualReport);
        return annualReportMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AnnualReportResponse getById(UUID id) {
        AnnualReport annualReport = annualReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AnnualReport", "id", id));
        return annualReportMapper.toResponse(annualReport);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnnualReportResponse> getAll() {
        return annualReportRepository.findAll().stream()
                .map(annualReportMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        if (!annualReportRepository.existsById(id)) {
            throw new ResourceNotFoundException("AnnualReport", "id", id);
        }
        annualReportRepository.deleteById(id);
    }
}
