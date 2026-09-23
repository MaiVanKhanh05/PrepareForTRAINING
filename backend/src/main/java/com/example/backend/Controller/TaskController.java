package com.example.backend.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.DTO.Task.CreateTaskRequest;
import com.example.backend.Service.TaskService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/create")
    public void createTask(@RequestBody CreateTaskRequest request) {
        taskService.createTask(request);
    }

    @GetMapping("/project/{projectId}")
    public java.util.List<com.example.backend.Entity.Task> getTasksByProjectId(@PathVariable String projectId) {
        return taskService.getTasksByProjectId(projectId);
    }
}
