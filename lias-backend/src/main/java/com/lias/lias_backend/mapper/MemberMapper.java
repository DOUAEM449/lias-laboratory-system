package com.lias.lias_backend.mapper;

import com.lias.lias_backend.dto.request.MemberCreateRequest;
import com.lias.lias_backend.dto.request.MemberUpdateRequest;
import com.lias.lias_backend.dto.response.MemberResponse;
import com.lias.lias_backend.entity.Member;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MemberMapper {

    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "statusHistories", ignore = true)
    @Mapping(target = "teamAffiliations", ignore = true)
    @Mapping(target = "mandates", ignore = true)
    @Mapping(target = "changedHistories", ignore = true)
    @Mapping(target = "leaderTeams", ignore = true)
    @Mapping(target = "publications", ignore = true)
    @Mapping(target = "createdEvents", ignore = true)
    @Mapping(target = "uploadedDocuments", ignore = true)
    @Mapping(target = "assignedEquipments", ignore = true)
    @Mapping(target = "equipmentAssignments", ignore = true)
    @Mapping(target = "approvedAssignments", ignore = true)
    @Mapping(target = "equipmentRequests", ignore = true)
    @Mapping(target = "reviewedEquipmentRequests", ignore = true)
    @Mapping(target = "reviewedMembershipRequests", ignore = true)
    @Mapping(target = "membershipRequests", ignore = true)
    @Mapping(target = "createdMeetings", ignore = true)
    @Mapping(target = "createdConventions", ignore = true)
    @Mapping(target = "createdDiscussions", ignore = true)
    @Mapping(target = "sentMessages", ignore = true)
    @Mapping(target = "notifications", ignore = true)
    @Mapping(target = "generatedReports", ignore = true)
    @Mapping(target = "participatedEvents", ignore = true)
    @Mapping(target = "attendedMeetings", ignore = true)
    @Mapping(target = "discussions", ignore = true)

    Member toEntity(MemberCreateRequest request);

    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "statusHistories", ignore = true)
    @Mapping(target = "teamAffiliations", ignore = true)
    @Mapping(target = "mandates", ignore = true)
    @Mapping(target = "changedHistories", ignore = true)
    @Mapping(target = "leaderTeams", ignore = true)
    @Mapping(target = "publications", ignore = true)
    @Mapping(target = "createdEvents", ignore = true)
    @Mapping(target = "uploadedDocuments", ignore = true)
    @Mapping(target = "assignedEquipments", ignore = true)
    @Mapping(target = "equipmentAssignments", ignore = true)
    @Mapping(target = "approvedAssignments", ignore = true)
    @Mapping(target = "equipmentRequests", ignore = true)
    @Mapping(target = "reviewedEquipmentRequests", ignore = true)
    @Mapping(target = "reviewedMembershipRequests", ignore = true)
    @Mapping(target = "membershipRequests", ignore = true)
    @Mapping(target = "createdMeetings", ignore = true)
    @Mapping(target = "createdConventions", ignore = true)
    @Mapping(target = "createdDiscussions", ignore = true)
    @Mapping(target = "sentMessages", ignore = true)
    @Mapping(target = "notifications", ignore = true)
    @Mapping(target = "generatedReports", ignore = true)
    @Mapping(target = "participatedEvents", ignore = true)
    @Mapping(target = "attendedMeetings", ignore = true)
    @Mapping(target = "discussions", ignore = true)
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deactivatedAt", ignore = true)
    void updateEntity(MemberUpdateRequest request, @MappingTarget Member member);

    MemberResponse toResponse(Member member);
}
