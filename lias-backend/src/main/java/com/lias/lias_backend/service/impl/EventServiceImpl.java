package com.lias.lias_backend.service.impl;

import com.lias.lias_backend.dto.request.EventCreateRequest;
import com.lias.lias_backend.dto.request.EventUpdateRequest;
import com.lias.lias_backend.dto.response.EventResponse;
import com.lias.lias_backend.entity.Event;
import com.lias.lias_backend.exception.ResourceNotFoundException;
import com.lias.lias_backend.mapper.EventMapper;
import com.lias.lias_backend.repository.EventRepository;
import com.lias.lias_backend.service.EventService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    public EventServiceImpl(EventRepository eventRepository, EventMapper eventMapper) {
        this.eventRepository = eventRepository;
        this.eventMapper = eventMapper;
    }

    @Override
    public EventResponse create(EventCreateRequest request) {
        Event event = eventMapper.toEntity(request);
        if (request.getParentEventId() != null) {
            Event parent = eventRepository.findById(request.getParentEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Event", "id", request.getParentEventId()));
            event.setParentEvent(parent);
        }
        Event saved = eventRepository.save(event);
        return eventMapper.toResponse(saved);
    }

    @Override
    public EventResponse update(UUID id, EventUpdateRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        eventMapper.updateEntity(request, event);
        Event saved = eventRepository.save(event);
        return eventMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public EventResponse getById(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        return eventMapper.toResponse(event);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventResponse> getAll() {
        return eventRepository.findAll().stream()
                .map(eventMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event", "id", id);
        }
        eventRepository.deleteById(id);
    }
}
