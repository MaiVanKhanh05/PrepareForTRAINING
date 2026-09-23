package com.example.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.DTO.Project.ProjectResponse;
import com.example.backend.Entity.ProjectMember;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, String> {

    List<ProjectMember> findByProjectId(String projectId);

    void deleteByProjectId(String projectId);

    @Query("""
        SELECT new com.example.backend.DTO.Project.ProjectResponse(
            p.id,
            p.name,
            p.description,
            p.owner.full_name,
            COUNT(pm.id),
            p.createdAt
        )
        FROM Project p
        LEFT JOIN ProjectMember pm
            ON pm.projectId = p.id
        GROUP BY
            p.id,
            p.name,
            p.description,
            p.owner.full_name,
            p.createdAt
    """)
    List<ProjectResponse> findAllWithMemberCount();

    @Query("""
        SELECT new com.example.backend.DTO.Project.ProjectResponse(
            p.id,
            p.name,
            p.description,
            p.owner.full_name,
            COUNT(pm.id),
            p.createdAt
        )
        FROM Project p
        LEFT JOIN ProjectMember pm
            ON pm.projectId = p.id
        WHERE EXISTS (
            SELECT 1 FROM ProjectMember pm2 
            WHERE pm2.projectId = p.id AND pm2.memberId = :userId
        )
        GROUP BY
            p.id,
            p.name,
            p.description,
            p.owner.full_name,
            p.createdAt
    """)
    List<ProjectResponse> findByMemberId(@Param("userId") String userId);
}
