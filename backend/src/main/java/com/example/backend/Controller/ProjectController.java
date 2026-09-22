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
import com.example.backend.DTO.Project.ProjectResponse;
import com.example.backend.Entity.Project;
import com.example.backend.Service.ProjectService;

@RestController 
@RequestMapping ("/api/projects")
public class ProjectController {
    private  ProjectMemberService projectMemberService;
    private  ProjectService projectService;

    public ProjectController(ProjectService projectService, ProjectMemberService projectMemberService){
        this.projectService = projectService;
        this.projectMemberService = projectMemberService;
    }

    @GetMapping()
    public List<ProjectResponse> getAllProjects() {
        return projectService.getAllProjects();
    }
     @PostMapping("/create")
     public void CreateProject(@RequestBody CreateProjectRequest CreateProjectRequest){
        try {
            projectService.CreateProject(CreateProjectRequest);
            projectMemberService.AddMemberToProject(CreateProjectRequest);
            } catch (Exception e) {
            System.out.println(e.getMessage());
        }
     }

      @DeleteMapping("/delete/{id}")
    public String deleteProjectById(@PathVariable String id) {//@PathVariable lấy giá trị từ url
        projectService.deleteProjectById(id);
        return "Project deleted successfully";
    }
    
}
