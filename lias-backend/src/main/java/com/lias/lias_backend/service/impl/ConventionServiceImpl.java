package com.lias.lias_backend.service.impl;

import com.lias.lias_backend.dto.request.ConventionCreateRequest;
import com.lias.lias_backend.dto.request.ConventionUpdateRequest;
import com.lias.lias_backend.dto.response.ConventionResponse;
import com.lias.lias_backend.entity.Convention;
import com.lias.lias_backend.entity.Document;
import com.lias.lias_backend.entity.Partner;
import com.lias.lias_backend.exception.ResourceNotFoundException;
import com.lias.lias_backend.mapper.ConventionMapper;
import com.lias.lias_backend.repository.ConventionRepository;
import com.lias.lias_backend.repository.DocumentRepository;
import com.lias.lias_backend.repository.PartnerRepository;
import com.lias.lias_backend.service.ConventionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ConventionServiceImpl implements ConventionService {

    private final ConventionRepository conventionRepository;
    private final PartnerRepository partnerRepository;
    private final DocumentRepository documentRepository;
    private final ConventionMapper conventionMapper;

    public ConventionServiceImpl(ConventionRepository conventionRepository, PartnerRepository partnerRepository,
                                  DocumentRepository documentRepository, ConventionMapper conventionMapper) {
        this.conventionRepository = conventionRepository;
        this.partnerRepository = partnerRepository;
        this.documentRepository = documentRepository;
        this.conventionMapper = conventionMapper;
    }

    @Override
    public ConventionResponse create(ConventionCreateRequest request) {
        Convention convention = conventionMapper.toEntity(request);
        if (request.getPartnerId() != null) {
            Partner partner = partnerRepository.findById(request.getPartnerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Partner", "id", request.getPartnerId()));
            convention.setPartner(partner);
        }
        if (request.getDocumentId() != null) {
            Document document = documentRepository.findById(request.getDocumentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Document", "id", request.getDocumentId()));
            convention.setDocument(document);
        }
        Convention saved = conventionRepository.save(convention);
        return conventionMapper.toResponse(saved);
    }

    @Override
    public ConventionResponse update(UUID id, ConventionUpdateRequest request) {
        Convention convention = conventionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Convention", "id", id));
        conventionMapper.updateEntity(request, convention);
        if (request.getDocumentId() != null) {
            Document document = documentRepository.findById(request.getDocumentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Document", "id", request.getDocumentId()));
            convention.setDocument(document);
        }
        Convention saved = conventionRepository.save(convention);
        return conventionMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ConventionResponse getById(UUID id) {
        Convention convention = conventionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Convention", "id", id));
        return conventionMapper.toResponse(convention);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConventionResponse> getAll() {
        return conventionRepository.findAll().stream()
                .map(conventionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        if (!conventionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Convention", "id", id);
        }
        conventionRepository.deleteById(id);
    }
}
