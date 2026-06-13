package com.lias.lias_backend.service;

import com.lias.lias_backend.dto.request.MembershipRequestCreateRequest;
import com.lias.lias_backend.dto.request.MembershipRequestUpdateRequest;
import com.lias.lias_backend.dto.response.MembershipRequestResponse;

import java.util.List;
import java.util.UUID;

public interface MembershipRequestService {
    MembershipRequestResponse create(MembershipRequestCreateRequest request);
    MembershipRequestResponse update(UUID id, MembershipRequestUpdateRequest request);
    MembershipRequestResponse getById(UUID id);
    List<MembershipRequestResponse> getAll();
    void delete(UUID id);
}
