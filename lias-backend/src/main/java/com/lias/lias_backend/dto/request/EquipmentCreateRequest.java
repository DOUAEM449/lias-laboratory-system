package com.lias.lias_backend.dto.request;

import com.lias.lias_backend.entity.enums.EquipmentStatus;
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
public class EquipmentCreateRequest {

    @NotBlank
    @Size(max = 255)
    private String name;

    private String description;

    @Size(max = 100)
    private String serialNumber;

    private LocalDate acquisitionDate;

    private EquipmentStatus status;

    private UUID assignedToId;
}
