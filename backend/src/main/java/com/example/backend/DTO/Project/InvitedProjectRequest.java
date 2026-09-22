package com.example.backend.DTO.Project;

import java.util.List;

public class InvitedProjectRequest {

    private String projectId;
    private String email;

    public InvitedProjectRequest() {
    }

    public InvitedProjectRequest(String projectId, String email) {
        this.projectId = projectId;
        this.email = email;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
