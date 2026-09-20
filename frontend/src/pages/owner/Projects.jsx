import React, { useState } from 'react';
import { Plus, Folder, MoreVertical, Calendar } from 'lucide-react';

const mockProjects = [
  { id: 1, name: 'E-commerce Redesign', description: 'Revamping the main shopping experience', members: 4, createdAt: '2026-09-10' },
  { id: 2, name: 'Mobile App V2', description: 'React Native app for iOS and Android', members: 6, createdAt: '2026-08-22' },
  { id: 3, name: 'Marketing Campaign', description: 'Q4 holiday season marketing materials', members: 2, createdAt: '2026-09-18' },
];

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        {mockProjects.map(project => (
          <div key={project.id} className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Folder className="h-6 w-6" />
              </div>
              <button className="text-zinc-400 hover:text-zinc-600 p-1">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
            <h3 className="font-semibold text-lg text-zinc-900 mb-2 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
            <p className="text-zinc-500 text-sm mb-6 line-clamp-2">{project.description}</p>
            
            <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {project.createdAt}
              </div>
              <div className="bg-zinc-100 px-2 py-1 rounded-md font-medium">
                {project.members} members
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100">
              <h2 className="text-xl font-bold text-zinc-900">Create New Project</h2>
              <p className="text-zinc-500 text-sm mt-1">Fill in the details to start a new project workspace.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Project Name</label>
                <input type="text" className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="e.g. Website Redesign" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                <textarea rows="3" className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Briefly describe the project goals..."></textarea>
              </div>
            </div>
            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-zinc-600 font-medium hover:bg-zinc-200/50 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm shadow-indigo-200">Create Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
