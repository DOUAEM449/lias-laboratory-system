package com.lias.lias_backend.service.impl;

import com.lias.lias_backend.dto.request.MeetingCreateRequest;
import com.lias.lias_backend.dto.request.MeetingUpdateRequest;
import com.lias.lias_backend.dto.response.MeetingResponse;
import com.lias.lias_backend.entity.Meeting;
import com.lias.lias_backend.entity.Team;
import com.lias.lias_backend.exception.ResourceNotFoundException;
import com.lias.lias_backend.mapper.MeetingMapper;
import com.lias.lias_backend.repository.MeetingRepository;
import com.lias.lias_backend.repository.TeamRepository;
import com.lias.lias_backend.service.MeetingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class MeetingServiceImpl implements MeetingService {

    private final MeetingRepository meetingRepository;
    private final TeamRepository teamRepository;
    private final MeetingMapper meetingMapper;

    public MeetingServiceImpl(MeetingRepository meetingRepository, TeamRepository teamRepository,
                               MeetingMapper meetingMapper) {
        this.meetingRepository = meetingRepository;
        this.teamRepository = teamRepository;
        this.meetingMapper = meetingMapper;
    }

    @Override
    public MeetingResponse create(MeetingCreateRequest request) {
        Meeting meeting = meetingMapper.toEntity(request);
        if (request.getTeamId() != null) {
            Team team = teamRepository.findById(request.getTeamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team", "id", request.getTeamId()));
            meeting.setTeam(team);
        }
        Meeting saved = meetingRepository.save(meeting);
        return meetingMapper.toResponse(saved);
    }

    @Override
    public MeetingResponse update(UUID id, MeetingUpdateRequest request) {
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting", "id", id));
        meetingMapper.updateEntity(request, meeting);
        if (request.getTeamId() != null) {
            Team team = teamRepository.findById(request.getTeamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team", "id", request.getTeamId()));
            meeting.setTeam(team);
        }
        Meeting saved = meetingRepository.save(meeting);
        return meetingMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public MeetingResponse getById(UUID id) {
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting", "id", id));
        return meetingMapper.toResponse(meeting);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MeetingResponse> getAll() {
        return meetingRepository.findAll().stream()
                .map(meetingMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        if (!meetingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Meeting", "id", id);
        }
        meetingRepository.deleteById(id);
    }
}
