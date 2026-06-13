package com.lias.lias_backend.dto.request;

import com.lias.lias_backend.entity.enums.PublicationType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicationUpdateRequest {

    private String title;

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
