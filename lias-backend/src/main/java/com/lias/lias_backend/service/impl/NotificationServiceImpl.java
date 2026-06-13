package com.lias.lias_backend.service.impl;

import com.lias.lias_backend.dto.request.NotificationCreateRequest;
import com.lias.lias_backend.dto.request.NotificationUpdateRequest;
import com.lias.lias_backend.dto.response.NotificationResponse;
import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.entity.Notification;
import com.lias.lias_backend.exception.ResourceNotFoundException;
import com.lias.lias_backend.mapper.NotificationMapper;
import com.lias.lias_backend.repository.MemberRepository;
import com.lias.lias_backend.repository.NotificationRepository;
import com.lias.lias_backend.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final MemberRepository memberRepository;
    private final NotificationMapper notificationMapper;

    public NotificationServiceImpl(NotificationRepository notificationRepository, MemberRepository memberRepository,
                                    NotificationMapper notificationMapper) {
        this.notificationRepository = notificationRepository;
        this.memberRepository = memberRepository;
        this.notificationMapper = notificationMapper;
    }

    @Override
    public NotificationResponse create(NotificationCreateRequest request) {
        Notification notification = notificationMapper.toEntity(request);
        if (request.getMemberId() != null) {
            Member member = memberRepository.findById(request.getMemberId())
                    .orElseThrow(() -> new ResourceNotFoundException("Member", "id", request.getMemberId()));
            notification.setMember(member);
        }
        Notification saved = notificationRepository.save(notification);
        return notificationMapper.toResponse(saved);
    }

    @Override
    public NotificationResponse update(UUID id, NotificationUpdateRequest request) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        notificationMapper.updateEntity(request, notification);
        Notification saved = notificationRepository.save(notification);
        return notificationMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationResponse getById(UUID id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        return notificationMapper.toResponse(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getAll() {
        return notificationRepository.findAll().stream()
                .map(notificationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        if (!notificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notification", "id", id);
        }
        notificationRepository.deleteById(id);
    }
}
