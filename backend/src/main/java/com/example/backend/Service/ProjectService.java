package com.example.backend.Service;

import com.example.backend.Repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.backend.DTO.Project.CreateProjectRequest;
import com.example.backend.DTO.Project.ProjectResponse;
import com.example.backend.Entity.Project;
import com.example.backend.Repository.ProjectRepository;

@Service 
public class ProjectService {
        private UserRepository userRepository;
        private ProjectRepository projectRepository;

        public ProjectService(ProjectRepository projectRepository, UserRepository userRepository){
            this.projectRepository = projectRepository;
            this.userRepository = userRepository;
        }

        public List<ProjectResponse> getAllProjects() {
            return projectRepository.findAllWithMemberCount();
        }

    public void CreateProject(CreateProjectRequest CreateProjectRequest){
        Project project = new Project();
        project.setId(CreateProjectRequest.getId());
        project.setName(CreateProjectRequest.getName());
        project.setDescription(CreateProjectRequest.getDescription());
        project.setOwner(userRepository.findById(CreateProjectRequest.getOwner_id())
        .orElseThrow(() -> new RuntimeException("Owner not found")));
        project.setCreatedAt(LocalDateTime.now());
        projectRepository.save(project);
}

public void deleteProjectById(String id) {
        projectRepository.deleteById(id);
    }

}

