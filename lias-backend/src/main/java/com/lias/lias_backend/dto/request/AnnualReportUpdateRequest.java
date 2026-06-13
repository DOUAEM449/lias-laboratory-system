package com.lias.lias_backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnualReportUpdateRequest {

    @Min(1901)
    @Max(2100)
    private Short reportYear;

    private UUID documentId;

    private String notes;
}
