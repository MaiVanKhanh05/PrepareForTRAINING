import React, { useState, useEffect } from 'react';
import { Plus, Folder, MoreVertical, Calendar, X, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Projects = () => {

  const token = localStorage.getItem("token");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const navigate = useNavigate();


  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);
  const ownerId = JSON.parse(localStorage.getItem('user')).id;

  const getAllProject = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/projects',
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      console.log(response);
      setProjects(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProject();
  }, [])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const handleEmailKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const email = emailInput.trim();

      if (email === "") return;


      if (emails.includes(email)) {
        setEmailInput("");
        alert("Email này đã được thêm!");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/users/check-email?email=${email}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });

        if (response.data === true) {
          setEmails([...emails, email]);
          setEmailInput("");
        } else {
          alert("Email " + email + " không tồn tại!");
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra email:", error);
        alert("Có lỗi xảy ra khi kiểm tra email!");
      }
    }
  };

  const handleCreate = async (e) => {
    const generateProjectId = () => {
      return Date.now().toString();
    };
    console.log({
      id: generateProjectId(),
      name,
      description,
      emails,
      ownerId
    });
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/projects/create',
        {
          id: generateProjectId(),
          name,
          description,
          email: emails,
          owner_id: ownerId
        },
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );


      setIsModalOpen(false);
      getAllProject(); // Refresh the list
      // Reset form
      setName("");
      setDescription("");
      setEmails([]);

    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      }
    }

  }


  const handleDelete = async (id) => {
    try {
      await axios.delete('http://localhost:8080/api/projects/delete/' + id,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }

      );

      await getAllProject();

    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Projects</h1>
          <p className="text-zinc-500 mt-1">Manage your active projects and create new ones.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-indigo-200"
        >
          <Plus className="h-5 w-5" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div
            key={project.id}
            onClick={() => navigate(`/owner/projects/${project.id}`)}
            className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Folder className="h-6 w-6" />
              </div>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdownId(openDropdownId === project.id ? null : project.id);
                  }}
                  className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                {openDropdownId === project.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-zinc-100 py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // handle Edit
                        setOpenDropdownId(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-indigo-600 flex items-center gap-2 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this project?')) {
                          handleDelete(project.id);
                        }
                        setOpenDropdownId(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                )}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100">
              <h2 className="text-xl font-bold text-zinc-900">Create New Project</h2>
              <p className="text-zinc-500 text-sm mt-1">Fill in the details to start a new project workspace.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Project Name</label>
                <input type="text" className="w-full px-3 py-2 border border-zinc-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="e.g. Website Redesign"
                  required
                  value={name} onChange={(e) => { setName(e.target.value); }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                <textarea rows="3" className="w-full px-3 py-2 border border-zinc-300 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="Briefly describe the project goals..."
                  required
                  value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>


              {/*
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Invite Members (Email)</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg
               focus:outline-none focus:ring-2 focus:ring-indigo-500/20
               focus:border-indigo-500"
                  placeholder="Enter email and press Enter"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={handleEmailKeyDown}
                />

                
                <div className="mt-2 flex gap-2 flex-wrap">
                  {emails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg">
                      <span className="text-sm">{email}</span>
                      <button type="button" onClick={() => setEmails(emails.filter((_, i) => i !== index))}
                        className="text-indigo-500 hover:text-indigo-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-500 mt-1">Separate multiple emails with commas</p>
              </div>
              
              */}

            </div>
            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-zinc-600 font-medium hover:bg-zinc-200/50 rounded-lg transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm shadow-indigo-200">Create Project</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Projects;
