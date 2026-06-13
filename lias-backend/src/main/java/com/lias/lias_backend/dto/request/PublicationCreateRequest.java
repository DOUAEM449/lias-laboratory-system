package com.lias.lias_backend.dto.request;

import com.lias.lias_backend.entity.enums.PublicationType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicationCreateRequest {

    @NotBlank
    private String title;

    @NotNull
    @Min(1901)
    @Max(2100)
    private Short pubYear;

    @Size(max = 255)
    private String journal;

    @Size(max = 255)
    private String conference;

    @Size(max = 255)
    private String doi;

    private String pdfUrl;

    private String abstract_;

    private PublicationType pubType;
}
