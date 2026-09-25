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
        // Add owner as a member automatically
        Optional<User> ownerOpt = userRepository.findById(CreateProjectRequest.getOwner_id());
        if (ownerOpt.isPresent()) {
            ProjectMember ownerMember = new ProjectMember();
            ownerMember.setId(java.util.UUID.randomUUID().toString());
            ownerMember.setProjectId(CreateProjectRequest.getId());
            ownerMember.setMemberId(ownerOpt.get().getId());
            ownerMember.setMemberName(ownerOpt.get().getFull_name());
            ownerMember.setJoinedAt(new Date());
            ownerMember.setRole("OWNER");
            projectMemberRepository.save(ownerMember);
        }

        if (CreateProjectRequest.getEmail() != null) {
            for (String email : CreateProjectRequest.getEmail()) {
                InviteMemberToProject(CreateProjectRequest.getId(), email);
            }
        }
    }

    //Invite new member to existing project
    public void InviteMemberToProject(String projectId, String email) {

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            throw new AppException(HttpStatus.CONFLICT,
                    "Email " + email + " không tồn tại");
        }

        List<ProjectMember> email_inProjectMembers = projectMemberRepository.findByProjectIdAndMemberId(projectId, user.get().getId());
        if (!email_inProjectMembers.isEmpty()) {
            throw new AppException(HttpStatus.CONFLICT,
                    "User " + email + " đã là thành viên của dự án");
        }

        ProjectMember projectMember = new ProjectMember();
        projectMember.setId(java.util.UUID.randomUUID().toString());
        projectMember.setProjectId(projectId);
        projectMember.setMemberId(user.get().getId());
        projectMember.setMemberName(user.get().getFull_name());
        projectMember.setJoinedAt(new Date());
        projectMemberRepository.save(projectMember);
    }

    @org.springframework.transaction.annotation.Transactional
    public void removeMemberFromProject(String projectId, String memberId) {
        List<ProjectMember> membership = projectMemberRepository.findByProjectIdAndMemberId(projectId, memberId);
        if (membership.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "Member is not in the project");
        }
        projectMemberRepository.deleteByProjectIdAndMemberId(projectId, memberId);
    }

    @org.springframework.transaction.annotation.Transactional
    public void changeMemberRole(String projectId, String memberId, String newRole) {
        List<ProjectMember> membership = projectMemberRepository.findByProjectIdAndMemberId(projectId, memberId);
        if (membership.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "Member is not in the project");
        }
        ProjectMember projectMember = membership.get(0);
        projectMember.setRole(newRole);
        projectMemberRepository.save(projectMember);
    }
}
