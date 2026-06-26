package com.lias.lias_backend.controller.member;

import com.lias.lias_backend.dto.request.MemberCreateRequest;
import com.lias.lias_backend.dto.request.MemberUpdateRequest;
import com.lias.lias_backend.dto.response.MemberResponse;
import com.lias.lias_backend.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MemberController {

    private final MemberService memberService;

    @PostMapping
    public MemberResponse create(@Valid @RequestBody MemberCreateRequest request) {
        return memberService.create(request);
    }

    @GetMapping
    public List<MemberResponse> getAll() {
        return memberService.getAll();
    }

    @GetMapping("/{id}")
    public MemberResponse getById(@PathVariable UUID id) {
        return memberService.getById(id);
    }

    @PutMapping("/{id}")
    public MemberResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody MemberUpdateRequest request) {
        return memberService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        memberService.delete(id);
    }
}