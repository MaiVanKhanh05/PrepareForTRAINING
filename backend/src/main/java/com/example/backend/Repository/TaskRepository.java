package com.example.backend.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.Entity.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findByProjectId(String projectId);
}
