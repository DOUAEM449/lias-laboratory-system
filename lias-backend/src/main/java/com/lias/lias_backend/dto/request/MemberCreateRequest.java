package com.lias.lias_backend.dto.request;

import com.lias.lias_backend.entity.enums.MemberStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberCreateRequest {

    @Email
    @NotBlank
    @Size(max = 255)
    private String email;

    @NotBlank
    private String passwordHash;

    @NotBlank
    @Size(min = 1, max = 100)
    private String firstName;

    @NotBlank
    @Size(min = 1, max = 100)
    private String lastName;

    @Size(max = 30)
    private String phone;

    private String bio;

    private String photoUrl;

    private LocalDate birthdate;

    private LocalDate hireDate;

    @Size(max = 255)
    private String institution;

    @Size(max = 255)
    private String originLab;

    private List<String> interests;

    private MemberStatus status;
}
