package com.lias.lias_backend.dto.response;

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
public class MessageResponse {

    private UUID id;

    private UUID discussionId;

    private UUID senderId;

    private String senderName;

    private String content;

    private Boolean isDeleted;

    private OffsetDateTime sentAt;

    private OffsetDateTime editedAt;
}
