package com.lias.lias_backend.dto.response;

import com.lias.lias_backend.entity.enums.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipRequestResponse {

    private UUID id;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String institution;

    private String cvUrl;

    private String motivationLetterUrl;

    private RequestStatus status;

    private UUID reviewedById;

    private String reviewedByName;

    private UUID memberId;

    private String notes;

    private OffsetDateTime submittedAt;

    private OffsetDateTime reviewedAt;
}
