package com.example.backend.Controller;

import com.example.backend.DTO.FileRequest;
import com.example.backend.DTO.FileResponse;
import com.example.backend.Service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/metadata")
    public ResponseEntity<FileResponse> saveFileMetadata(@RequestBody FileRequest request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        FileResponse response = fileService.saveFileMetadata(request, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<FileResponse>> getFilesByProject(@PathVariable String projectId) {
        return ResponseEntity.ok(fileService.getFilesByProject(projectId));
    }
}
