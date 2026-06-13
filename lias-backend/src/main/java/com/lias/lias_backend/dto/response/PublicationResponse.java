package com.lias.lias_backend.dto.response;

import com.lias.lias_backend.entity.enums.PublicationType;
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
public class PublicationResponse {

    private UUID id;

    private String title;

    private Short pubYear;

    private String journal;

    private String conference;

    private String doi;

    private String pdfUrl;

    private String abstract_;

    private PublicationType pubType;

    private UUID submittedById;

    private String submittedByName;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;
}
