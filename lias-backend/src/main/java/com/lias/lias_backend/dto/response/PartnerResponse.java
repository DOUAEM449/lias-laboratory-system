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
public class PartnerResponse {

    private UUID id;

    private String name;

    private String country;

    private String website;

    private String description;

    private OffsetDateTime createdAt;
}
