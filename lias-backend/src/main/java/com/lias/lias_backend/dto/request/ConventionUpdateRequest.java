package com.lias.lias_backend.dto.request;

import com.lias.lias_backend.entity.enums.ConventionStatus;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConventionUpdateRequest {

    @Size(max = 255)
    private String title;

    private ConventionStatus status;

    private LocalDate startDate;

    private LocalDate endDate;

    private String description;

    private UUID documentId;
}
