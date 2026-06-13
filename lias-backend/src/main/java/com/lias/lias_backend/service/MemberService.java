package com.lias.lias_backend.service;

import com.lias.lias_backend.dto.request.MemberCreateRequest;
import com.lias.lias_backend.dto.request.MemberUpdateRequest;
import com.lias.lias_backend.dto.response.MemberResponse;

import java.util.List;
import java.util.UUID;

public interface MemberService {
    MemberResponse create(MemberCreateRequest request);
    MemberResponse update(UUID id, MemberUpdateRequest request);
    MemberResponse getById(UUID id);
    List<MemberResponse> getAll();
    void delete(UUID id);
}
