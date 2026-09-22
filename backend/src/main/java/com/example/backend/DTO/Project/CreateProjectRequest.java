package com.example.backend.DTO.Project;

import java.util.List;

public class CreateProjectRequest {
    private String id;
    private String name;
    private String description;
    private String owner_id;
    private List<String> email;

    public CreateProjectRequest() {
    }

    public CreateProjectRequest(String id, String name, String description,  String owner_id, List<String> email) {
        this.id = id;
        this.description = description;
        this.email = email;
        this.name = name;
        this.owner_id = owner_id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOwner_id() {
        return owner_id;
    }

    public void setOwner_id(String owner_id) {
        this.owner_id = owner_id;
    }

    public List<String> getEmail() {
        return email;
    }

    public void setEmail(List<String> email) {
        this.email = email;
    }


    

}
