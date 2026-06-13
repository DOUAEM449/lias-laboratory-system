package com.lias.lias_backend.dto.response;

import com.lias.lias_backend.entity.enums.ConventionStatus;
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
public class ConventionResponse {

    private UUID id;

    private String title;

    private UUID partnerId;

    private String partnerName;

    private ConventionStatus status;

    private LocalDate startDate;

    private LocalDate endDate;

    private String description;

    private UUID documentId;

    private UUID createdById;

    private String createdByName;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;
}
