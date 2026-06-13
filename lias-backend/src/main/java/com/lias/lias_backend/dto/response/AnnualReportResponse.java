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
public class AnnualReportResponse {

    private UUID id;

    private Short reportYear;

    private UUID documentId;

    private String documentTitle;

    private UUID generatedById;

    private String generatedByName;

    private OffsetDateTime generatedAt;

    private String notes;
}
