package com.lias.lias_backend.service.impl;

import com.lias.lias_backend.dto.request.MembershipRequestCreateRequest;
import com.lias.lias_backend.dto.request.MembershipRequestUpdateRequest;
import com.lias.lias_backend.dto.response.MembershipRequestResponse;
import com.lias.lias_backend.entity.MembershipRequest;
import com.lias.lias_backend.exception.ResourceNotFoundException;
import com.lias.lias_backend.mapper.MembershipRequestMapper;
import com.lias.lias_backend.repository.MembershipRequestRepository;
import com.lias.lias_backend.service.MembershipRequestService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class MembershipRequestServiceImpl implements MembershipRequestService {

    private final MembershipRequestRepository membershipRequestRepository;
    private final MembershipRequestMapper membershipRequestMapper;

    public MembershipRequestServiceImpl(MembershipRequestRepository membershipRequestRepository,
                                        MembershipRequestMapper membershipRequestMapper) {
        this.membershipRequestRepository = membershipRequestRepository;
        this.membershipRequestMapper = membershipRequestMapper;
    }

    @Override
    public MembershipRequestResponse create(MembershipRequestCreateRequest request) {
        MembershipRequest membershipRequest = membershipRequestMapper.toEntity(request);
        MembershipRequest saved = membershipRequestRepository.save(membershipRequest);
        return membershipRequestMapper.toResponse(saved);
    }

    @Override
    public MembershipRequestResponse update(UUID id, MembershipRequestUpdateRequest request) {
        MembershipRequest membershipRequest = membershipRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MembershipRequest", "id", id));
        membershipRequestMapper.updateEntity(request, membershipRequest);
        MembershipRequest saved = membershipRequestRepository.save(membershipRequest);
        return membershipRequestMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public MembershipRequestResponse getById(UUID id) {
        MembershipRequest membershipRequest = membershipRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MembershipRequest", "id", id));
        return membershipRequestMapper.toResponse(membershipRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MembershipRequestResponse> getAll() {
        return membershipRequestRepository.findAll().stream()
                .map(membershipRequestMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        if (!membershipRequestRepository.existsById(id)) {
            throw new ResourceNotFoundException("MembershipRequest", "id", id);
        }
        membershipRequestRepository.deleteById(id);
    }
}
