package com.example.backend.DTO.Project;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import com.example.backend.Entity.ProjectMember;

public class ProjectResponse {

    private String id;
    private String name;
    private String description;
    private String ownerName;
    private long memberCount;
    private LocalDateTime createdAt;
    private List<ProjectMember> members;

    public ProjectResponse(String id, String name, String description, String ownerName, long memberCount, LocalDateTime createdAt, List<ProjectMember> members) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.ownerName = ownerName;
        this.memberCount = memberCount;
        this.createdAt = createdAt;
        this.members = members;
    }

    public ProjectResponse(String id, String name, String description, String ownerName, long memberCount, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.ownerName = ownerName;
        this.memberCount = memberCount;
        this.createdAt = createdAt;
    }

    public ProjectResponse() {
    }

    public List<ProjectMember> getMembers() {
        return members;
    }

    public void setMembers(List<ProjectMember> members) {
        this.members = members;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public long getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(long memberCount) {
        this.memberCount = memberCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}
