package com.lias.lias_backend.security;

import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Member not found with email: " + email));

        if (!member.getIsActive()) {
            throw new UsernameNotFoundException("Member account is deactivated: " + email);
        }

        // Derive role from permission level stored in mandates or assign default
        // Use ROLE_ADMIN for permission >= 90, ROLE_TEAM_LEADER >= 60, else ROLE_MEMBER
        String role = determineRole(member);

        return User.builder()
                .username(member.getEmail())
                .password(member.getPasswordHash())
                .authorities(List.of(new SimpleGrantedAuthority(role)))
                .accountExpired(false)
                .accountLocked(!member.getIsActive())
                .credentialsExpired(false)
                .disabled(!member.getIsActive())
                .build();
    }

    private String determineRole(Member member) {
        // Check mandates for admin/director roles
        boolean isAdmin = member.getMandates().stream()
                .anyMatch(m -> m.getIsCurrent() &&
                        m.getRole() != null &&
                        m.getRole().getPermissionLevel() >= 90);

        boolean isTeamLeader = member.getMandates().stream()
                .anyMatch(m -> m.getIsCurrent() &&
                        m.getRole() != null &&
                        m.getRole().getPermissionLevel() >= 60);

        if (isAdmin) return "ROLE_ADMIN";
        if (isTeamLeader) return "ROLE_TEAM_LEADER";
        return "ROLE_MEMBER";
    }
}
