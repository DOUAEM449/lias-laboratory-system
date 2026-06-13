package com.lias.lias_backend.dto.response;

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
public class MeetingResponse {

    private UUID id;

    private String title;

    private OffsetDateTime scheduledAt;

    private String agenda;

    private UUID teamId;

    private String teamName;

    private String minutesUrl;

    private UUID createdById;

    private String createdByName;

    private Boolean isArchived;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;
}
