package com.example.backend.Service;

import java.util.Date;
import java.util.UUID;
import org.springframework.stereotype.Service;
import com.example.backend.DTO.Task.CreateTaskRequest;
import com.example.backend.Entity.Task;
import com.example.backend.Entity.User;
import com.example.backend.Entity.ProjectMember;
import com.example.backend.Repository.TaskRepository;
import com.example.backend.Repository.UserRepository;
import com.example.backend.Repository.ProjectMemberRepository;
import com.example.backend.Exception.AppException;
import org.springframework.http.HttpStatus;
import java.util.Optional;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository, ProjectMemberRepository projectMemberRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
    }

    public void createTask(CreateTaskRequest request) {
        Task task = new Task();
        task.setId(UUID.randomUUID().toString());
        task.setProjectId(request.getProjectId());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        
        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            task.setStatus(request.getStatus());
        } else {
            task.setStatus("TODO");
        }
        
        if (request.getAssignedTo() != null && !request.getAssignedTo().trim().isEmpty()) {
            Optional<User> assigneeOpt = userRepository.findById(request.getAssignedTo());
            if (assigneeOpt.isEmpty()) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Assigned user does not exist");
            }
            User assignee = assigneeOpt.get();
            if (!"USER".equals(assignee.getRole())) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Assigned user must have role USER");
            }

            List<ProjectMember> membership = projectMemberRepository.findByProjectIdAndMemberId(request.getProjectId(), request.getAssignedTo());
            if (membership.isEmpty()) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Assigned user must be a member of the project");
            }

            task.setAssignedTo(request.getAssignedTo());
        }
        
        task.setCreatedAt(new Date());
        task.setDueDate(request.getDueDate());
        
        taskRepository.save(task);
    }

    public java.util.List<Task> getTasksByProjectId(String projectId) {
        return taskRepository.findByProjectId(projectId);
    }
}
