import React, { useState, useEffect } from 'react';
import { Folder, Calendar } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const token = localStorage.getItem("token");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const payload = JSON.parse(atob(token.split('.')[1]));
  const userid = payload.sub;

  console.log(payload);
  console.log("userid:", payload.sub);
  console.log("userId:", payload.userId);

  const getMyProjects = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/projects/${userid}`,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      setProjects(response.data);
    } catch (error) {
      console.log("Endpoint /api/projects/user might not exist yet:", error);
    }
  };

  useEffect(() => {
    getMyProjects();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">My Projects</h1>
          <p className="text-zinc-500 mt-1">View the projects you are currently a member of.</p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-zinc-200 shadow-sm text-center">
          <Folder className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-zinc-900 mb-2">No Projects Found</h3>
          <p className="text-zinc-500">You haven't been added to any projects yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div
              key={project.id}
              onClick={() => navigate('/home/projects/' + project.id)}
              className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Folder className="h-6 w-6" />
                </div>
              </div>
              <h3 className="font-semibold text-lg text-zinc-900 mb-2 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
              <p className="text-zinc-500 text-sm mb-6 line-clamp-2">{project.description}</p>

              <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-zinc-100">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(project.createdAt)}
                </div>
                <div className="bg-zinc-100 px-2 py-1 rounded-md font-medium">
                  {project.memberCount} members
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
