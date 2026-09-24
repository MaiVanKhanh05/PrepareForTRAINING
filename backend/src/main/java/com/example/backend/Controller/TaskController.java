package com.example.backend.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import com.example.backend.DTO.Task.CreateTaskRequest;
import com.example.backend.DTO.Task.UpdateTaskRequest;
import com.example.backend.Entity.Task;
import com.example.backend.Service.TaskService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createTask(@RequestBody CreateTaskRequest task) {

        taskService.createTask(task);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Task created successfully",
                        "task", task
                ));
    }

    @GetMapping("/project/{projectId}")
    public java.util.List<Task> getTasksByProjectId(@PathVariable String projectId) {
        return taskService.getTasksByProjectId(projectId);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable String taskId, @RequestBody UpdateTaskRequest request) {
        taskService.updateTask(taskId, request);
        return ResponseEntity.ok(Map.of("message", "Task updated successfully"));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable String taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
    }
}
