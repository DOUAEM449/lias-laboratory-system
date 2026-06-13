package com.lias.lias_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentRequestCreateRequest {

    private UUID equipmentId;
    private UUID memberId;

    @NotBlank
    private String description;
}
