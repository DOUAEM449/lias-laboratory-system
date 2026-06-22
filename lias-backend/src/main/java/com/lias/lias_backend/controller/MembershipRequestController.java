package com.lias.lias_backend.controller;

import com.lias.lias_backend.dto.request.MembershipRequestCreateRequest;
import com.lias.lias_backend.dto.request.MembershipRequestUpdateRequest;
import com.lias.lias_backend.dto.response.MembershipRequestResponse;
import com.lias.lias_backend.service.MembershipRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/membership-requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MembershipRequestController {

    private final MembershipRequestService membershipRequestService;

    // ✅ CREATE (registration)
    @PostMapping
    public ResponseEntity<MembershipRequestResponse> create(
            @RequestBody MembershipRequestCreateRequest request) {

        return ResponseEntity.ok(
                membershipRequestService.create(request)
        );
    }

    // ✅ GET ALL
    @GetMapping
    public ResponseEntity<List<MembershipRequestResponse>> getAll() {
        return ResponseEntity.ok(
                membershipRequestService.getAll()
        );
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<MembershipRequestResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(
                membershipRequestService.getById(id)
        );
    }

    // ✅ UPDATE (optional admin edit)
    @PutMapping("/{id}")
    public ResponseEntity<MembershipRequestResponse> update(
            @PathVariable UUID id,
            @RequestBody MembershipRequestUpdateRequest request) {

        return ResponseEntity.ok(
                membershipRequestService.update(id, request)
        );
    }

    // ✅ APPROVE (admin workflow)
    @PutMapping("/{id}/approve")
    public ResponseEntity<MembershipRequestResponse> approve(
            @PathVariable UUID id,
            @RequestParam UUID reviewerId,
            @RequestParam(required = false) String notes) {

        return ResponseEntity.ok(
                membershipRequestService.approve(id, reviewerId, notes)
        );
    }

    // ✅ REJECT (admin workflow)
    @PutMapping("/{id}/reject")
    public ResponseEntity<MembershipRequestResponse> reject(
            @PathVariable UUID id,
            @RequestParam UUID reviewerId,
            @RequestParam(required = false) String notes) {

        return ResponseEntity.ok(
                membershipRequestService.reject(id, reviewerId, notes)
        );
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        membershipRequestService.delete(id);
        return ResponseEntity.noContent().build();
    }
}