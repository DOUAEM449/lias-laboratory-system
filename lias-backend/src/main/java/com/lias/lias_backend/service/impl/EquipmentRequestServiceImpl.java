package com.lias.lias_backend.service.impl;

import com.lias.lias_backend.dto.request.EquipmentRequestCreateRequest;
import com.lias.lias_backend.dto.request.EquipmentRequestUpdateRequest;
import com.lias.lias_backend.dto.response.EquipmentRequestResponse;
import com.lias.lias_backend.entity.Equipment;
import com.lias.lias_backend.entity.EquipmentRequest;
import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.exception.ResourceNotFoundException;
import com.lias.lias_backend.mapper.EquipmentRequestMapper;
import com.lias.lias_backend.repository.EquipmentRepository;
import com.lias.lias_backend.repository.EquipmentRequestRepository;
import com.lias.lias_backend.repository.MemberRepository;
import com.lias.lias_backend.service.EquipmentRequestService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class EquipmentRequestServiceImpl implements EquipmentRequestService {

    private final EquipmentRequestRepository equipmentRequestRepository;
    private final MemberRepository memberRepository;
    private final EquipmentRepository equipmentRepository;
    private final EquipmentRequestMapper equipmentRequestMapper;

    public EquipmentRequestServiceImpl(EquipmentRequestRepository equipmentRequestRepository,
                                       MemberRepository memberRepository,
                                       EquipmentRepository equipmentRepository,
                                       EquipmentRequestMapper equipmentRequestMapper) {
        this.equipmentRequestRepository = equipmentRequestRepository;
        this.memberRepository = memberRepository;
        this.equipmentRepository = equipmentRepository;
        this.equipmentRequestMapper = equipmentRequestMapper;
    }

    @Override
    public EquipmentRequestResponse create(EquipmentRequestCreateRequest request) {
        EquipmentRequest equipmentRequest = equipmentRequestMapper.toEntity(request);
        if (request.getMemberId() != null) {
            Member member = memberRepository.findById(request.getMemberId())
                    .orElseThrow(() -> new ResourceNotFoundException("Member", "id", request.getMemberId()));
            equipmentRequest.setMember(member);
        }
        if (request.getEquipmentId() != null) {
            Equipment equipment = equipmentRepository.findById(request.getEquipmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Equipment", "id", request.getEquipmentId()));
            equipmentRequest.setEquipment(equipment);
        }
        EquipmentRequest saved = equipmentRequestRepository.save(equipmentRequest);
        return equipmentRequestMapper.toResponse(saved);
    }

    @Override
    public EquipmentRequestResponse update(UUID id, EquipmentRequestUpdateRequest request) {
        EquipmentRequest equipmentRequest = equipmentRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EquipmentRequest", "id", id));
        equipmentRequestMapper.updateEntity(request, equipmentRequest);
        EquipmentRequest saved = equipmentRequestRepository.save(equipmentRequest);
        return equipmentRequestMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public EquipmentRequestResponse getById(UUID id) {
        EquipmentRequest equipmentRequest = equipmentRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EquipmentRequest", "id", id));
        return equipmentRequestMapper.toResponse(equipmentRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EquipmentRequestResponse> getAll() {
        return equipmentRequestRepository.findAll().stream()
                .map(equipmentRequestMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        if (!equipmentRequestRepository.existsById(id)) {
            throw new ResourceNotFoundException("EquipmentRequest", "id", id);
        }
        equipmentRequestRepository.deleteById(id);
    }
}
