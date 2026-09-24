package com.example.backend.Service;

import com.example.backend.DTO.FileRequest;
import com.example.backend.DTO.FileResponse;
import com.example.backend.Entity.FileEntity;
import com.example.backend.Repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    public FileResponse saveFileMetadata(FileRequest request, String uploadedBy) {
        FileEntity file = new FileEntity();
        file.setProjectId(request.getProjectId());
        file.setUploadedBy(uploadedBy);
        file.setOriginalName(request.getOriginalName());
        file.setStoredName(request.getStoredName());
        file.setFilePath(request.getFilePath());
        file.setFileType(request.getFileType());
        file.setFileSize(request.getFileSize());

        FileEntity savedFile = fileRepository.save(file);
        return mapToResponse(savedFile);
    }

    public List<FileResponse> getFilesByProject(String projectId) {
        return fileRepository.findByProjectId(projectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private FileResponse mapToResponse(FileEntity entity) {
        FileResponse response = new FileResponse();
        response.setId(entity.getId());
        response.setProjectId(entity.getProjectId());
        response.setUploadedBy(entity.getUploadedBy());
        response.setOriginalName(entity.getOriginalName());
        response.setStoredName(entity.getStoredName());
        response.setFilePath(entity.getFilePath());
        response.setFileType(entity.getFileType());
        response.setFileSize(entity.getFileSize());
        response.setUploadedAt(entity.getUploadedAt());
        return response;
    }
}
