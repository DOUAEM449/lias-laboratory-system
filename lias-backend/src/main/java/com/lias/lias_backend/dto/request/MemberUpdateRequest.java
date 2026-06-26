package com.lias.lias_backend.dto.request;

import com.lias.lias_backend.entity.enums.MemberStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
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
public class MemberUpdateRequest {

    @Email
    @Size(max = 255)
    private String email;

    @Size(min = 1, max = 100)
    private String firstName;

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

    // private List<String> interests;

    private MemberStatus status;

    private Boolean isActive;
}
