package com.example.backend.Service;

import com.example.backend.Repository.ProjectRepository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.backend.DTO.Project.CreateProjectRequest;
import com.example.backend.Entity.Project;
import com.example.backend.Entity.ProjectMember;
import com.example.backend.Entity.User;
import com.example.backend.Exception.AppException;
import com.example.backend.Repository.ProjectMemberRepository;
import com.example.backend.Repository.UserRepository;

@Service
public class ProjectMemberService {

    private final ProjectRepository projectRepository;
    private ProjectMemberRepository projectMemberRepository;
    private UserRepository userRepository;

    public ProjectMemberService(ProjectRepository projectRepository, ProjectMemberRepository projectMemberRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userRepository = userRepository;
    }

    public List<ProjectMember> getProjectMembers(String projectId) {
        return projectMemberRepository.findByProjectId(projectId);
    }

    //Create new project
    public void AddMemberToProject(CreateProjectRequest CreateProjectRequest) {
        for (String email : CreateProjectRequest.getEmail()) {

            Optional<User> user = userRepository.findByEmail(email);

            if (user.isEmpty()) {
                throw new AppException(HttpStatus.CONFLICT,
                        "Email " + email + " không tồn tại");
            }

            ProjectMember projectMember = new ProjectMember();
            projectMember.setId(java.util.UUID.randomUUID().toString());
            projectMember.setProjectId(CreateProjectRequest.getId());
            projectMember.setMemberId(user.get().getId());
            projectMember.setJoinedAt(new Date());
            projectMemberRepository.save(projectMember);
        }
    }

    //Invite new member to existing project
    public void InviteMemberToProject(String projectId, String email) {

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            throw new AppException(HttpStatus.CONFLICT,
                    "Email " + email + " không tồn tại");
        }

        ProjectMember projectMember = new ProjectMember();
        projectMember.setId(java.util.UUID.randomUUID().toString());
        projectMember.setProjectId(projectId);
        projectMember.setMemberId(user.get().getId());
        projectMember.setJoinedAt(new Date());
        projectMemberRepository.save(projectMember);
    }

}
