package com.example.backend.Service;

import java.util.Date;
import java.util.UUID;
import org.springframework.stereotype.Service;
import com.example.backend.DTO.Task.CreateTaskRequest;
import com.example.backend.Entity.Task;
import com.example.backend.Repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
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
