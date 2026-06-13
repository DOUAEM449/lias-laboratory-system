package com.lias.lias_backend.service.impl;

import com.lias.lias_backend.dto.request.DiscussionCreateRequest;
import com.lias.lias_backend.dto.request.DiscussionUpdateRequest;
import com.lias.lias_backend.dto.response.DiscussionResponse;
import com.lias.lias_backend.entity.Discussion;
import com.lias.lias_backend.entity.Event;
import com.lias.lias_backend.entity.Team;
import com.lias.lias_backend.exception.ResourceNotFoundException;
import com.lias.lias_backend.mapper.DiscussionMapper;
import com.lias.lias_backend.repository.DiscussionRepository;
import com.lias.lias_backend.repository.EventRepository;
import com.lias.lias_backend.repository.TeamRepository;
import com.lias.lias_backend.service.DiscussionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class DiscussionServiceImpl implements DiscussionService {

    private final DiscussionRepository discussionRepository;
    private final TeamRepository teamRepository;
    private final EventRepository eventRepository;
    private final DiscussionMapper discussionMapper;

    public DiscussionServiceImpl(DiscussionRepository discussionRepository, TeamRepository teamRepository,
                                  EventRepository eventRepository, DiscussionMapper discussionMapper) {
        this.discussionRepository = discussionRepository;
        this.teamRepository = teamRepository;
        this.eventRepository = eventRepository;
        this.discussionMapper = discussionMapper;
    }

    @Override
    public DiscussionResponse create(DiscussionCreateRequest request) {
        Discussion discussion = discussionMapper.toEntity(request);
        if (request.getTeamId() != null) {
            Team team = teamRepository.findById(request.getTeamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team", "id", request.getTeamId()));
            discussion.setTeam(team);
        }
        if (request.getEventId() != null) {
            Event event = eventRepository.findById(request.getEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Event", "id", request.getEventId()));
            discussion.setEvent(event);
        }
        Discussion saved = discussionRepository.save(discussion);
        return discussionMapper.toResponse(saved);
    }

    @Override
    public DiscussionResponse update(UUID id, DiscussionUpdateRequest request) {
        Discussion discussion = discussionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discussion", "id", id));
        discussionMapper.updateEntity(request, discussion);
        Discussion saved = discussionRepository.save(discussion);
        return discussionMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DiscussionResponse getById(UUID id) {
        Discussion discussion = discussionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discussion", "id", id));
        return discussionMapper.toResponse(discussion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DiscussionResponse> getAll() {
        return discussionRepository.findAll().stream()
                .map(discussionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        if (!discussionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Discussion", "id", id);
        }
        discussionRepository.deleteById(id);
    }
}
