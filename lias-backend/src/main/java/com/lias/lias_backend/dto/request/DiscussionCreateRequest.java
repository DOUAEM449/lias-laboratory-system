package com.lias.lias_backend.dto.request;

import com.lias.lias_backend.entity.enums.DiscussionScope;
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
public class DiscussionCreateRequest {

    @Size(max = 255)
    private String title;

    private DiscussionScope scope;

    private UUID teamId;

    private UUID eventId;
}
