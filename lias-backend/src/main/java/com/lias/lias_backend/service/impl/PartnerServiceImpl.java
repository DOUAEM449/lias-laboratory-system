package com.lias.lias_backend.service.impl;

import com.lias.lias_backend.dto.request.PartnerCreateRequest;
import com.lias.lias_backend.dto.request.PartnerUpdateRequest;
import com.lias.lias_backend.dto.response.PartnerResponse;
import com.lias.lias_backend.entity.Partner;
import com.lias.lias_backend.exception.ResourceNotFoundException;
import com.lias.lias_backend.mapper.PartnerMapper;
import com.lias.lias_backend.repository.PartnerRepository;
import com.lias.lias_backend.service.PartnerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PartnerServiceImpl implements PartnerService {

    private final PartnerRepository partnerRepository;
    private final PartnerMapper partnerMapper;

    public PartnerServiceImpl(PartnerRepository partnerRepository, PartnerMapper partnerMapper) {
        this.partnerRepository = partnerRepository;
        this.partnerMapper = partnerMapper;
    }

    @Override
    public PartnerResponse create(PartnerCreateRequest request) {
        Partner partner = partnerMapper.toEntity(request);
        Partner saved = partnerRepository.save(partner);
        return partnerMapper.toResponse(saved);
    }

    @Override
    public PartnerResponse update(UUID id, PartnerUpdateRequest request) {
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partner", "id", id));
        partnerMapper.updateEntity(request, partner);
        Partner saved = partnerRepository.save(partner);
        return partnerMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PartnerResponse getById(UUID id) {
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partner", "id", id));
        return partnerMapper.toResponse(partner);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PartnerResponse> getAll() {
        return partnerRepository.findAll().stream()
                .map(partnerMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        if (!partnerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Partner", "id", id);
        }
        partnerRepository.deleteById(id);
    }
}
