package com.lias.lias_backend.service;

import com.lias.lias_backend.dto.request.TeamCreateRequest;
import com.lias.lias_backend.dto.request.TeamUpdateRequest;
import com.lias.lias_backend.dto.response.TeamResponse;

import java.util.List;
import java.util.UUID;

public interface TeamService {
    TeamResponse create(TeamCreateRequest request);
    TeamResponse update(UUID id, TeamUpdateRequest request);
    TeamResponse getById(UUID id);
    List<TeamResponse> getAll();
    void delete(UUID id);
}
