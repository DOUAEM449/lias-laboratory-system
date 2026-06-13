package com.lias.lias_backend.dto.response;

import com.lias.lias_backend.entity.enums.EquipmentStatus;
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
public class EquipmentResponse {

    private UUID id;

    private String name;

    private String description;

    private String serialNumber;

    private LocalDate acquisitionDate;

    private EquipmentStatus status;

    private UUID assignedToId;

    private String assignedToName;

    private Boolean isAvailable;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;
}
