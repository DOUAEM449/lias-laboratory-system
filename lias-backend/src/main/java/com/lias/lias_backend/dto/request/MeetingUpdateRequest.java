package com.lias.lias_backend.dto.request;

import jakarta.validation.constraints.Size;
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
public class MeetingUpdateRequest {

    @Size(max = 255)
    private String title;

    private OffsetDateTime scheduledAt;

    private String agenda;

    private String minutesUrl;

    private UUID teamId;

    private Boolean isArchived;
}
