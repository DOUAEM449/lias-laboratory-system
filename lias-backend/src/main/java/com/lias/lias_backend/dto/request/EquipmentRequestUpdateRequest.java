package com.lias.lias_backend.dto.request;

import com.lias.lias_backend.entity.enums.EquipmentRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentRequestUpdateRequest {

    private EquipmentRequestStatus status;

    private String notes;
}
