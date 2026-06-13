package com.lias.lias_backend.service.impl;

import com.lias.lias_backend.dto.request.DocumentCreateRequest;
import com.lias.lias_backend.dto.request.DocumentUpdateRequest;
import com.lias.lias_backend.dto.response.DocumentResponse;
import com.lias.lias_backend.entity.Document;
import com.lias.lias_backend.entity.Event;
import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.entity.Team;
import com.lias.lias_backend.exception.ResourceNotFoundException;
import com.lias.lias_backend.mapper.DocumentMapper;
import com.lias.lias_backend.repository.DocumentRepository;
import com.lias.lias_backend.repository.EventRepository;
import com.lias.lias_backend.repository.MemberRepository;
import com.lias.lias_backend.repository.TeamRepository;
import com.lias.lias_backend.service.DocumentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final TeamRepository teamRepository;
    private final EventRepository eventRepository;
    private final MemberRepository memberRepository;
    private final DocumentMapper documentMapper;

    public DocumentServiceImpl(DocumentRepository documentRepository, TeamRepository teamRepository,
                                EventRepository eventRepository, MemberRepository memberRepository,
                                DocumentMapper documentMapper) {
        this.documentRepository = documentRepository;
        this.teamRepository = teamRepository;
        this.eventRepository = eventRepository;
        this.memberRepository = memberRepository;
        this.documentMapper = documentMapper;
    }

    @Override
    public DocumentResponse create(DocumentCreateRequest request) {
        Document document = documentMapper.toEntity(request);
        if (request.getTeamId() != null) {
            Team team = teamRepository.findById(request.getTeamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team", "id", request.getTeamId()));
            document.setTeam(team);
        }
        if (request.getEventId() != null) {
            Event event = eventRepository.findById(request.getEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Event", "id", request.getEventId()));
            document.setEvent(event);
        }
        if (request.getParentDocId() != null) {
            Document parent = documentRepository.findById(request.getParentDocId())
                    .orElseThrow(() -> new ResourceNotFoundException("Document", "id", request.getParentDocId()));
            document.setParentDoc(parent);
        }
        Document saved = documentRepository.save(document);
        return documentMapper.toResponse(saved);
    }

    @Override
    public DocumentResponse update(UUID id, DocumentUpdateRequest request) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "id", id));
        documentMapper.updateEntity(request, document);
        Document saved = documentRepository.save(document);
        return documentMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentResponse getById(UUID id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "id", id));
        return documentMapper.toResponse(document);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getAll() {
        return documentRepository.findAll().stream()
                .map(documentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        if (!documentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Document", "id", id);
        }
        documentRepository.deleteById(id);
    }
}
