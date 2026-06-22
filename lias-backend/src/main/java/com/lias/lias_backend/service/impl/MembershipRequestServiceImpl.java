package com.lias.lias_backend.service.impl;

import com.lias.lias_backend.dto.request.MembershipRequestCreateRequest;
import com.lias.lias_backend.dto.request.MembershipRequestUpdateRequest;
import com.lias.lias_backend.dto.response.MembershipRequestResponse;
import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.entity.MembershipRequest;
import com.lias.lias_backend.entity.enums.MemberStatus;
import com.lias.lias_backend.entity.enums.RequestStatus;
import com.lias.lias_backend.exception.BusinessRuleException;
import com.lias.lias_backend.exception.ResourceNotFoundException;
import com.lias.lias_backend.mapper.MembershipRequestMapper;
import com.lias.lias_backend.repository.MemberRepository;
import com.lias.lias_backend.repository.MembershipRequestRepository;
import com.lias.lias_backend.service.MembershipRequestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class MembershipRequestServiceImpl implements MembershipRequestService {

    private static final Logger log = LoggerFactory.getLogger(MembershipRequestServiceImpl.class);

    private final MembershipRequestRepository membershipRequestRepository;
    private final MemberRepository memberRepository;
    private final MembershipRequestMapper membershipRequestMapper;
    private final PasswordEncoder passwordEncoder;

    public MembershipRequestServiceImpl(MembershipRequestRepository membershipRequestRepository,
                                        MemberRepository memberRepository,
                                        MembershipRequestMapper membershipRequestMapper,
                                        PasswordEncoder passwordEncoder) {
        this.membershipRequestRepository = membershipRequestRepository;
        this.memberRepository = memberRepository;
        this.membershipRequestMapper = membershipRequestMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public MembershipRequestResponse create(MembershipRequestCreateRequest request) {
        log.info("Creating membership request for email={}", request.getEmail());
        if (memberRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BusinessRuleException("A member with this email already exists");
        }
        if (membershipRequestRepository.findByEmail(request.getEmail())
                .filter(existing -> existing.getStatus() == RequestStatus.PENDING
                        || existing.getStatus() == RequestStatus.UNDER_REVIEW)
                .isPresent()) {
            throw new BusinessRuleException("A pending membership request already exists for this email");
        }

        MembershipRequest membershipRequest = membershipRequestMapper.toEntity(request);
        log.debug("Persisting new membership request for email={}", request.getEmail());
        MembershipRequest saved = membershipRequestRepository.saveAndFlush(membershipRequest);
        log.info("Membership request created id={}", saved.getId());
        return membershipRequestMapper.toResponse(saved);
    }

    @Override
    public MembershipRequestResponse update(UUID id, MembershipRequestUpdateRequest request) {
        log.info("Updating membership request id={}", id);
        MembershipRequest membershipRequest = membershipRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MembershipRequest", "id", id));
        membershipRequestMapper.updateEntity(request, membershipRequest);
        log.debug("Persisting membership request update id={}", id);
        MembershipRequest saved = membershipRequestRepository.saveAndFlush(membershipRequest);
        log.info("Membership request updated id={}", saved.getId());
        return membershipRequestMapper.toResponse(saved);
    }

    @Override
    public MembershipRequestResponse approve(UUID id, UUID reviewerId, String notes) {
        log.info("Approving membership request id={} by reviewerId={}", id, reviewerId);
        MembershipRequest membershipRequest = membershipRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MembershipRequest", "id", id));

        if (membershipRequest.getStatus() != RequestStatus.PENDING
                && membershipRequest.getStatus() != RequestStatus.UNDER_REVIEW) {
            throw new BusinessRuleException(
                    "Only pending or under-review requests can be approved. Current status: "
                            + membershipRequest.getStatus());
        }

        Member reviewer = memberRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", reviewerId));

        if (memberRepository.findByEmail(membershipRequest.getEmail()).isPresent()) {
            throw new BusinessRuleException("A member with this email already exists");
        }

        Member newMember = buildMemberFromRequest(membershipRequest);
        log.debug("Saving new member for email={} before approval commit", newMember.getEmail());
        Member savedMember = memberRepository.saveAndFlush(newMember);
        log.info("Member persisted id={} email={}", savedMember.getId(), savedMember.getEmail());

        membershipRequest.setStatus(RequestStatus.APPROVED);
        membershipRequest.setReviewedBy(reviewer);
        membershipRequest.setReviewedAt(OffsetDateTime.now());
        membershipRequest.setMember(savedMember);
        membershipRequest.setNotes(notes);

        log.debug("Updating membership request id={} to APPROVED with memberId={}", id, savedMember.getId());
        MembershipRequest savedRequest = membershipRequestRepository.saveAndFlush(membershipRequest);
        log.info("Membership request approved id={} memberId={} — transaction will commit on method return",
                savedRequest.getId(), savedMember.getId());

        return membershipRequestMapper.toResponse(savedRequest);
    }

    @Override
    public MembershipRequestResponse reject(UUID id, UUID reviewerId, String notes) {
        log.info("Rejecting membership request id={} by reviewerId={}", id, reviewerId);
        MembershipRequest membershipRequest = membershipRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MembershipRequest", "id", id));

        if (membershipRequest.getStatus() != RequestStatus.PENDING
                && membershipRequest.getStatus() != RequestStatus.UNDER_REVIEW) {
            throw new BusinessRuleException(
                    "Only pending or under-review requests can be rejected. Current status: "
                            + membershipRequest.getStatus());
        }

        Member reviewer = memberRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", reviewerId));

        membershipRequest.setStatus(RequestStatus.REJECTED);
        membershipRequest.setReviewedBy(reviewer);
        membershipRequest.setReviewedAt(OffsetDateTime.now());
        membershipRequest.setMember(null);
        membershipRequest.setNotes(notes);

        log.debug("Persisting rejected membership request id={}", id);
        MembershipRequest savedRequest = membershipRequestRepository.saveAndFlush(membershipRequest);
        log.info("Membership request rejected id={}", savedRequest.getId());

        return membershipRequestMapper.toResponse(savedRequest);
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

    private Member buildMemberFromRequest(MembershipRequest request) {
        String temporaryPassword = UUID.randomUUID().toString();
        return Member.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .institution(request.getInstitution())
                .passwordHash(passwordEncoder.encode(temporaryPassword))
                .status(MemberStatus.PHD)
                .isActive(true)
                .hireDate(LocalDate.now())
                .build();
    }
}
