package com.lias.lias_backend.service.impl;

import com.lias.lias_backend.dto.request.PublicationCreateRequest;
import com.lias.lias_backend.dto.request.PublicationUpdateRequest;
import com.lias.lias_backend.dto.response.PublicationResponse;
import com.lias.lias_backend.entity.Publication;
import com.lias.lias_backend.exception.ResourceNotFoundException;
import com.lias.lias_backend.mapper.PublicationMapper;
import com.lias.lias_backend.repository.PublicationRepository;
import com.lias.lias_backend.service.PublicationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PublicationServiceImpl implements PublicationService {

    private final PublicationRepository publicationRepository;
    private final PublicationMapper publicationMapper;

    public PublicationServiceImpl(PublicationRepository publicationRepository, PublicationMapper publicationMapper) {
        this.publicationRepository = publicationRepository;
        this.publicationMapper = publicationMapper;
    }

    @Override
    public PublicationResponse create(PublicationCreateRequest request) {
        Publication publication = publicationMapper.toEntity(request);
        Publication saved = publicationRepository.save(publication);
        return publicationMapper.toResponse(saved);
    }

    @Override
    public PublicationResponse update(UUID id, PublicationUpdateRequest request) {
        Publication publication = publicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Publication", "id", id));
        publicationMapper.updateEntity(request, publication);
        Publication saved = publicationRepository.save(publication);
        return publicationMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PublicationResponse getById(UUID id) {
        Publication publication = publicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Publication", "id", id));
        return publicationMapper.toResponse(publication);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PublicationResponse> getAll() {
        return publicationRepository.findAll().stream()
                .map(publicationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        if (!publicationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Publication", "id", id);
        }
        publicationRepository.deleteById(id);
    }
}
