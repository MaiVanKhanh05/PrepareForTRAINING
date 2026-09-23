package com.example.backend.Entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "project_members")
public class ProjectMember {
    @Id
    private String id;
    
    @Column(name = "project_id")
    private String projectId;
    
    @Column(name = "user_id")
    private String memberId;
    
    @Column(name = "joined_at")
    private Date joinedAt;

    @Column(name = "member_name")
    @com.fasterxml.jackson.annotation.JsonProperty("Name")
    private String memberName;

    public ProjectMember() {
    }

    public ProjectMember(Date joinedAt, String id, String memberId, String projectId) {
        this.joinedAt = joinedAt;
        this.id = id;
        this.memberId = memberId;
        this.projectId = projectId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public Date getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Date joinedAt) {
        this.joinedAt = joinedAt;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }
}
