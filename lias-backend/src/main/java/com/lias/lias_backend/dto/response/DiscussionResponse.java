package com.lias.lias_backend.dto.response;

import com.lias.lias_backend.entity.enums.DiscussionScope;
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
public class DiscussionResponse {

    private UUID id;

    private String title;

    private DiscussionScope scope;

    private UUID teamId;

    private String teamName;

    private UUID eventId;

    private String eventTitle;

    private UUID createdById;

    private String createdByName;

    private OffsetDateTime createdAt;

    private Integer participantCount;

    private Integer messageCount;
}
