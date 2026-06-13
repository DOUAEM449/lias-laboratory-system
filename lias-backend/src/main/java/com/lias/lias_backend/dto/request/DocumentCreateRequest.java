package com.lias.lias_backend.dto.request;

import com.lias.lias_backend.entity.enums.DocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentCreateRequest {

    @NotBlank
    @Size(max = 255)
    private String title;

    private DocumentType docType;

    private String description;

    @NotBlank
    private String fileUrl;

    private UUID parentDocId;

    private UUID teamId;

    private UUID eventId;
}
