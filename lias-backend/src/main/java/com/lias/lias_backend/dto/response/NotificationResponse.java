package com.lias.lias_backend.dto.response;

import com.lias.lias_backend.entity.enums.NotificationType;
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
public class NotificationResponse {

    private UUID id;

    private UUID memberId;

    private NotificationType type;

    private String title;

    private String body;

    private Boolean isRead;

    private String refTable;

    private UUID refId;

    private OffsetDateTime createdAt;
}
