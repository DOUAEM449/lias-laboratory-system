package com.lias.lias_backend.service;
import com.lias.lias_backend.repository.RoleRepository;
import com.lias.lias_backend.dto.auth.RegisterRequest;
import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.entity.Role;
import com.lias.lias_backend.entity.User;
import com.lias.lias_backend.repository.MemberRepository;
import com.lias.lias_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Role USER not found"));

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);

        Member member = new Member();
        member.setFirstName(request.getFirstName());
        member.setLastName(request.getLastName());
        member.setPhone(request.getPhone());
        member.setInstitution(request.getInstitution());

        member.setUser(user);
        user.setMember(member);

        userRepository.save(user);

        return "User registered successfully";
    }
}