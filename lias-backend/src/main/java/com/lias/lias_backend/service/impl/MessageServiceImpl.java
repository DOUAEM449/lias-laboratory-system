package com.lias.lias_backend.service.impl;

import com.lias.lias_backend.dto.request.MessageCreateRequest;
import com.lias.lias_backend.dto.request.MessageUpdateRequest;
import com.lias.lias_backend.dto.response.MessageResponse;
import com.lias.lias_backend.entity.Discussion;
import com.lias.lias_backend.entity.Message;
import com.lias.lias_backend.exception.ResourceNotFoundException;
import com.lias.lias_backend.mapper.MessageMapper;
import com.lias.lias_backend.repository.DiscussionRepository;
import com.lias.lias_backend.repository.MessageRepository;
import com.lias.lias_backend.service.MessageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final DiscussionRepository discussionRepository;
    private final MessageMapper messageMapper;

    public MessageServiceImpl(MessageRepository messageRepository, DiscussionRepository discussionRepository,
                               MessageMapper messageMapper) {
        this.messageRepository = messageRepository;
        this.discussionRepository = discussionRepository;
        this.messageMapper = messageMapper;
    }

    @Override
    public MessageResponse create(MessageCreateRequest request) {
        Message message = messageMapper.toEntity(request);
        if (request.getDiscussionId() != null) {
            Discussion discussion = discussionRepository.findById(request.getDiscussionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Discussion", "id", request.getDiscussionId()));
            message.setDiscussion(discussion);
        }
        Message saved = messageRepository.save(message);
        return messageMapper.toResponse(saved);
    }

    @Override
    public MessageResponse update(UUID id, MessageUpdateRequest request) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message", "id", id));
        messageMapper.updateEntity(request, message);
        Message saved = messageRepository.save(message);
        return messageMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public MessageResponse getById(UUID id) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message", "id", id));
        return messageMapper.toResponse(message);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getAll() {
        return messageRepository.findAll().stream()
                .map(messageMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        if (!messageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Message", "id", id);
        }
        messageRepository.deleteById(id);
    }
}
