package com.lias.lias_backend.dto.response;

import com.lias.lias_backend.entity.enums.MemberStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberResponse {

    private UUID id;

    private String email;

    private String firstName;

    private String lastName;

    private String phone;

    private String bio;

    private String photoUrl;

    private LocalDate birthdate;

    private LocalDate hireDate;

    private String institution;

    private String originLab;

    // private List<String> interests;

    private MemberStatus status;

    private Boolean isActive;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    private OffsetDateTime deactivatedAt;
}
