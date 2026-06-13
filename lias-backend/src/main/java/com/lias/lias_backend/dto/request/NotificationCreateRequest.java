package com.lias.lias_backend.dto.request;

import com.lias.lias_backend.entity.enums.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationCreateRequest {

    private UUID memberId;

    private NotificationType type;

    @NotBlank
    @Size(max = 255)
    private String title;

    private String body;

    private String refTable;

    private UUID refId;
}
