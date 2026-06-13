package com.lias.lias_backend.dto.response;

import com.lias.lias_backend.entity.enums.EventType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResponse {

    private UUID id;

    private String title;

    private EventType eventType;

    private String description;

    private String location;

    private LocalDate startDate;

    private LocalDate endDate;

    private UUID parentEventId;

    private UUID createdById;

    private String createdByName;

    private Boolean isArchived;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;
}
