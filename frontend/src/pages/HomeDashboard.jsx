import React, { useEffect, useState } from 'react';
import {
  Folder,
  FileText,
  Users,
  Upload,
  MessageSquare,
  MoreVertical,
  FileImage,
  FileVideo,
  FileSpreadsheet
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const mockProjects = [
  { id: 1, name: 'Q3 Marketing Campaign', role: 'Owner', members: 4, files: 12, updated: '2 hrs ago' },
  { id: 2, name: 'Website Redesign', role: 'Admin', members: 8, files: 45, updated: '5 hrs ago' },
  { id: 3, name: 'Financial Audit 2026', role: 'User', members: 2, files: 8, updated: '1 day ago' },
];

const mockDocuments = [
  { id: 1, name: 'Q3_Report.pdf', type: 'pdf', project: 'Q3 Marketing Campaign', size: '2.4 MB', date: 'Oct 12, 2026' },
  { id: 2, name: 'Hero_Image_Draft.png', type: 'image', project: 'Website Redesign', size: '4.1 MB', date: 'Oct 11, 2026' },
  { id: 3, name: 'Budget_v2.xlsx', type: 'spreadsheet', project: 'Financial Audit 2026', size: '1.2 MB', date: 'Oct 10, 2026' },
  { id: 4, name: 'Promo_Video_Final.mp4', type: 'video', project: 'Q3 Marketing Campaign', size: '145 MB', date: 'Oct 09, 2026' },
];

const getFileIcon = (type) => {
  switch (type) {
    case 'image': return <FileImage className="w-8 h-8 text-blue-500" />;
    case 'video': return <FileVideo className="w-8 h-8 text-purple-500" />;
    case 'spreadsheet': return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
    default: return <FileText className="w-8 h-8 text-red-500" />;
  }
};

const HomeDashboard = () => {

  const token = localStorage.getItem("token");
  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const payload = JSON.parse(atob(token.split('.')[1]));
  const userid = payload.sub;

  const navigate = useNavigate();

  const getMyProjects = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/projects/${userid}`,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );

      setMyProjects(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProject = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/projects',
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );

      setProjects(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProject();
    getMyProjects();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, Alex</h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">Here's an overview of your workspaces and documents.</p>
        </div>
        <div className="mt-5 sm:mt-0 flex flex-wrap gap-3">
          <button className="inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 transition-all active:scale-95">
            <Upload className="w-4 h-4 mr-2 text-slate-500" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">

        {/* My Projects - 3/12 */}
        <div onClick={() => navigate('/home/projects')} className="hover:cursor-pointer md:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center hover:shadow-md transition-shadow cursor-default">
          <div className="p-3.5 rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
            <Folder className="w-6 h-6" />
          </div>

          <div className="ml-5">
            <p className="text-sm font-medium text-slate-500">
              Active Projects
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {myProjects.length}
            </p>
          </div>
        </div>


        {/* AI Assistant - 9/12 */}
        <div className="md:col-span-9 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden">

          {/* Background decorations */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay"></div>

          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-indigo-400 opacity-20 rounded-full blur-2xl"></div>


          {/* Content */}
          <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">

            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-indigo-100 mb-4 backdrop-blur-sm">
              ✨ AI Powered
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
              Chat with your documents
            </h2>

            <p className="text-indigo-100 text-sm md:text-base max-w-xl leading-relaxed">
              Ask questions, summarize files, and extract data across all your
              projects instantly using our advanced AI assistant. No more manual
              searching.
            </p>

          </div>


          {/* Button */}
          <div className="relative z-10 w-full md:w-auto flex justify-end">

            <button className="w-full md:w-auto bg-white text-indigo-700 px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-900/20 hover:shadow-xl hover:bg-indigo-50 transform hover:-translate-y-0.5 transition-all flex items-center justify-center active:scale-95">

              <MessageSquare className="w-5 h-5 mr-2.5" />

              Try AI Assistant

            </button>

          </div>

        </div>

      </div>

      {/* Chatbot Teaser */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-indigo-400 opacity-20 rounded-full blur-2xl"></div>

        <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-indigo-100 mb-4 backdrop-blur-sm">
            ✨ AI Powered
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Chat with your documents</h2>
          <p className="text-indigo-100 text-sm md:text-base max-w-xl leading-relaxed">
            Ask questions, summarize files, and extract data across all your projects instantly using our advanced AI assistant. No more manual searching.
          </p>
        </div>
        <div className="relative z-10 w-full md:w-auto flex justify-end">
          <button className="w-full md:w-auto bg-white text-indigo-700 px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-900/20 hover:shadow-xl hover:bg-indigo-50 transform hover:-translate-y-0.5 transition-all flex items-center justify-center active:scale-95">
            <MessageSquare className="w-5 h-5 mr-2.5" />
            Try AI Assistant
          </button>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="animate-in fade-in slide-in-from-bottom-7 duration-700">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Projects</h2>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-all">View all projects</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProjects.map(project => (
            <div key={project.id}
              onClick={() => navigate('/home/projects/' + project.id)}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                    <Folder className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 line-clamp-1 group-hover:text-indigo-700 transition-colors">{project.name}</h3>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold tracking-wide ${project.role === 'Admin' ? 'bg-fuchsia-100 text-fuchsia-700' :
                        project.role === 'Owner' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                        <span className="font-semibold text-blue-700">Owner: {project.ownerName}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-all">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center tooltip" title="Members">
                    <Users className="w-4 h-4 mr-1.5 text-slate-400" />
                    <span className="font-medium text-slate-600">{project.memberCount}</span>
                  </div>
                  <div className="flex items-center tooltip" title="Files">
                    <FileText className="w-4 h-4 mr-1.5 text-slate-400" />
                    <span className="font-medium text-slate-600">{project.files}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  <p>{formatDate(project.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Documents</h2>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-all">View all files</button>
        </div>
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {mockDocuments.map(doc => (
              <li key={doc.id} className="p-4 sm:px-6 hover:bg-slate-50/80 transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center min-w-0 flex-1" >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-50">
                    {getFileIcon(doc.type)}
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">{doc.name}</p>
                    <div className="flex items-center text-xs text-slate-500 mt-1 sm:space-x-2 flex-wrap">
                      <span className="truncate font-medium">{doc.project}</span>
                      <span className="hidden sm:inline-block text-slate-300">•</span>
                      <span className="hidden sm:inline-block">{doc.size}</span>
                      <span className="hidden sm:inline-block text-slate-300">•</span>
                      <span className="hidden sm:inline-block">{doc.date}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                    View
                  </button>
                  <button className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-lg transition-colors">
                    Download
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors sm:hidden">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
