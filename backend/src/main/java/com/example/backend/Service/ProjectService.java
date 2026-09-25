package com.example.backend.Service;

import com.example.backend.Repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.backend.DTO.Project.CreateProjectRequest;
import com.example.backend.DTO.Project.ProjectResponse;
import com.example.backend.Entity.Project;
import com.example.backend.Entity.ProjectMember;
import com.example.backend.Exception.AppException;
import com.example.backend.Repository.ProjectMemberRepository;
import com.example.backend.Repository.ProjectRepository;

@Service
public class ProjectService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final com.example.backend.Repository.TaskRepository taskRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository, ProjectMemberRepository projectMemberRepository, com.example.backend.Repository.TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.taskRepository = taskRepository;
    }

    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAllWithMemberCount();
    }

    public void CreateProject(CreateProjectRequest CreateProjectRequest) {
        Project project = new Project();
        project.setId(CreateProjectRequest.getId());
        project.setName(CreateProjectRequest.getName());
        project.setDescription(CreateProjectRequest.getDescription());
        project.setOwner(userRepository.findById(CreateProjectRequest.getOwner_id())
                .orElseThrow(() -> new RuntimeException("Owner not found")));
        project.setCreatedAt(LocalDateTime.now());
        projectRepository.save(project);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteProjectById(String id) {
        taskRepository.deleteByProjectId(id);
        projectMemberRepository.deleteByProjectId(id);
        projectRepository.deleteById(id);
    }

    public ProjectResponse getProjectById(String id) {
        ProjectResponse project = projectRepository.findProjectById(id);

        if (project == null) {
            throw new AppException(HttpStatus.NOT_FOUND, "Project not found");
        }

        List<ProjectMember> members = projectMemberRepository.findByProjectId(id);
        project.setMembers(members);

        return project;

    }

    public List<ProjectResponse> getMyProjects(String userid) {
        return projectMemberRepository.findByMemberId(userid);
    }

    public ProjectResponse InsertMemberToProjectById(String id) {
        ProjectResponse project = projectRepository.findProjectById(id);

        if (project == null) {
            throw new AppException(HttpStatus.NOT_FOUND, "Project not found");
        }

        List<ProjectMember> members = projectMemberRepository.findByProjectId(project.getId());
        project.setMembers(members);

        return project;
    }


}
