package com.example.backend.Controller;

import com.example.backend.Service.ProjectMemberService;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.DTO.Project.CreateProjectRequest;
import com.example.backend.DTO.Project.InvitedProjectRequest;
import com.example.backend.DTO.Project.ProjectResponse;
import com.example.backend.Entity.Project;
import com.example.backend.Entity.ProjectMember;
import com.example.backend.Service.ProjectService;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.transaction.annotation.Transactional;


@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private ProjectMemberService projectMemberService;
    private ProjectService projectService;

    public ProjectController(ProjectService projectService, ProjectMemberService projectMemberService) {
        this.projectService = projectService;
        this.projectMemberService = projectMemberService;
    }

    @GetMapping()
    public List<ProjectResponse> getAllProjects() {
        return projectService.getAllProjects();
    }

    @PostMapping("/create")
    @Transactional
    public void CreateProject(@RequestBody CreateProjectRequest CreateProjectRequest) {
        projectService.CreateProject(CreateProjectRequest);
        projectMemberService.AddMemberToProject(CreateProjectRequest);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteProjectById(@PathVariable String id) {//@PathVariable lấy giá trị từ url
        projectService.deleteProjectById(id);
        return "Project deleted successfully";
    }


    @PostMapping("/invite")
    public void InviteMemberToProject(@RequestBody InvitedProjectRequest invitedProjectRequest) {
        projectMemberService.InviteMemberToProject(invitedProjectRequest.getProjectId(), invitedProjectRequest.getEmail());
    }

    @DeleteMapping("/{projectId}/members/{memberId}")
    public String removeMemberFromProject(@PathVariable String projectId, @PathVariable String memberId) {
        projectMemberService.removeMemberFromProject(projectId, memberId);
        return "Member removed successfully";
    }

    @org.springframework.web.bind.annotation.PutMapping("/{projectId}/members/{memberId}/role")
    public String updateProjectMemberRole(@PathVariable String projectId, @PathVariable String memberId, @RequestBody java.util.Map<String, String> body) {
        String newRole = body.get("role");
        if (newRole != null) {
            projectMemberService.changeMemberRole(projectId, memberId, newRole);
            return "Project member role updated successfully";
        }
        throw new RuntimeException("Role is missing");
    }

    @GetMapping("/{userId}")
    public List<ProjectResponse> getMyProjects(@PathVariable String userId) {
        return projectService.getMyProjects(userId);
    }

    @GetMapping("/detail/{projectId}")
    public ProjectResponse getProjectById(@PathVariable String projectId) {
        return projectService.getProjectById(projectId);
    }
    
}
