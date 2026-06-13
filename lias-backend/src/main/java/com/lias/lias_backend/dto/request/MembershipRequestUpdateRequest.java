package com.lias.lias_backend.dto.request;

import com.lias.lias_backend.entity.enums.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipRequestUpdateRequest {

    private RequestStatus status;

    private String notes;
}
