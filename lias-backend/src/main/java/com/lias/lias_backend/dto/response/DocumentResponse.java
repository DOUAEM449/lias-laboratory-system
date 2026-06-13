package com.lias.lias_backend.dto.response;

import com.lias.lias_backend.entity.enums.DocumentType;
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
public class DocumentResponse {

    private UUID id;

    private String title;

    private DocumentType docType;

    private String description;

    private String fileUrl;

    private Short version;

    private UUID parentDocId;

    private UUID teamId;

    private String teamName;

    private UUID eventId;

    private String eventTitle;

    private UUID uploadedById;

    private String uploadedByName;

    private Boolean isArchived;

    private OffsetDateTime createdAt;
}
