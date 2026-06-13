package com.lias.lias_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerCreateRequest {

    @NotBlank
    @Size(max = 255)
    private String name;

    @Size(max = 100)
    private String country;

    private String website;

    private String description;
}
