package com.lias.lias_backend.dto.response;

import com.lias.lias_backend.entity.enums.EquipmentRequestStatus;
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
public class EquipmentRequestResponse {

    private UUID id;

    private UUID memberId;

    private String memberName;

    private UUID equipmentId;

    private String equipmentName;

    private String description;

    private EquipmentRequestStatus status;

    private UUID reviewedById;

    private String reviewedByName;

    private OffsetDateTime reviewedAt;

    private String notes;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;
}
