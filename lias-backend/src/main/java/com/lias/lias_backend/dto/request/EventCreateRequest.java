package com.lias.lias_backend.dto.request;

import com.lias.lias_backend.entity.enums.EventType;
import jakarta.validation.constraints.NotBlank;
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
public class EventCreateRequest {

    @NotBlank
    @Size(max = 255)
    private String title;

    private EventType eventType;

    private String description;

    @Size(max = 255)
    private String location;

    private LocalDate startDate;

    private LocalDate endDate;

    private UUID parentEventId;
}
