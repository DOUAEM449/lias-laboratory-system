package com.lias.lias_backend.service.impl;

import com.lias.lias_backend.dto.request.TeamCreateRequest;
import com.lias.lias_backend.dto.request.TeamUpdateRequest;
import com.lias.lias_backend.dto.response.TeamResponse;
import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.entity.Team;
import com.lias.lias_backend.exception.ResourceNotFoundException;
import com.lias.lias_backend.mapper.TeamMapper;
import com.lias.lias_backend.repository.MemberRepository;
import com.lias.lias_backend.repository.TeamRepository;
import com.lias.lias_backend.service.TeamService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final MemberRepository memberRepository;
    private final TeamMapper teamMapper;

    public TeamServiceImpl(TeamRepository teamRepository, MemberRepository memberRepository, TeamMapper teamMapper) {
        this.teamRepository = teamRepository;
        this.memberRepository = memberRepository;
        this.teamMapper = teamMapper;
    }

    @Override
    public TeamResponse create(TeamCreateRequest request) {
        Team team = teamMapper.toEntity(request);
        if (request.getLeaderId() != null) {
            Member leader = memberRepository.findById(request.getLeaderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Member", "id", request.getLeaderId()));
            team.setLeader(leader);
        }
        Team saved = teamRepository.save(team);
        return teamMapper.toResponse(saved);
    }

    @Override
    public TeamResponse update(UUID id, TeamUpdateRequest request) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", id));
        teamMapper.updateEntity(request, team);
        if (request.getLeaderId() != null) {
            Member leader = memberRepository.findById(request.getLeaderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Member", "id", request.getLeaderId()));
            team.setLeader(leader);
        }
        Team saved = teamRepository.save(team);
        return teamMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public TeamResponse getById(UUID id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", id));
        return teamMapper.toResponse(team);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamResponse> getAll() {
        return teamRepository.findAll().stream()
                .map(teamMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        if (!teamRepository.existsById(id)) {
            throw new ResourceNotFoundException("Team", "id", id);
        }
        teamRepository.deleteById(id);
    }
}
