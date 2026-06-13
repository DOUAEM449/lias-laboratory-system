package com.lias.lias_backend.service.impl;

import com.lias.lias_backend.dto.request.EquipmentCreateRequest;
import com.lias.lias_backend.dto.request.EquipmentUpdateRequest;
import com.lias.lias_backend.dto.response.EquipmentResponse;
import com.lias.lias_backend.entity.Equipment;
import com.lias.lias_backend.exception.ResourceNotFoundException;
import com.lias.lias_backend.mapper.EquipmentMapper;
import com.lias.lias_backend.repository.EquipmentRepository;
import com.lias.lias_backend.service.EquipmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentMapper equipmentMapper;

    public EquipmentServiceImpl(EquipmentRepository equipmentRepository, EquipmentMapper equipmentMapper) {
        this.equipmentRepository = equipmentRepository;
        this.equipmentMapper = equipmentMapper;
    }

    @Override
    public EquipmentResponse create(EquipmentCreateRequest request) {
        Equipment equipment = equipmentMapper.toEntity(request);
        Equipment saved = equipmentRepository.save(equipment);
        return equipmentMapper.toResponse(saved);
    }

    @Override
    public EquipmentResponse update(UUID id, EquipmentUpdateRequest request) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment", "id", id));
        equipmentMapper.updateEntity(request, equipment);
        Equipment saved = equipmentRepository.save(equipment);
        return equipmentMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public EquipmentResponse getById(UUID id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment", "id", id));
        return equipmentMapper.toResponse(equipment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EquipmentResponse> getAll() {
        return equipmentRepository.findAll().stream()
                .map(equipmentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        if (!equipmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Equipment", "id", id);
        }
        equipmentRepository.deleteById(id);
    }
}
