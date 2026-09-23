import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  Folder,
  FileText,
  Settings,
  Search,
  Bell,
  Layout,
  MessageSquare,
  LogOut
} from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.includes('/home/projects') ? 'projects' : 
                    location.pathname.includes('/home/documents') ? 'documents' : 
                    location.pathname.includes('/home/chat') ? 'chat' : 'dashboard';

  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-inner">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">DocuFlow</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => navigate('/home')}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Layout className={`w-5 h-5 mr-3 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`} />
            Dashboard
          </button>
          <button
            onClick={() => navigate('/home/projects')}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'projects' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Folder className={`w-5 h-5 mr-3 ${activeTab === 'projects' ? 'text-indigo-600' : 'text-slate-400'}`} />
            Projects
          </button>
          <button
            onClick={() => navigate('/home/documents')}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'documents' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <FileText className={`w-5 h-5 mr-3 ${activeTab === 'documents' ? 'text-indigo-600' : 'text-slate-400'}`} />
            Documents
          </button>
          <button
            onClick={() => navigate('/home/chat')}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'chat' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <MessageSquare className={`w-5 h-5 mr-3 ${activeTab === 'chat' ? 'text-indigo-600' : 'text-slate-400'}`} />
            AI Chatbot
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Settings className="w-5 h-5 mr-3 text-slate-400" />
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-2"
          >
            <LogOut className="w-5 h-5 mr-3 text-red-500" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex-1 max-w-xl flex items-center">
            <div className="relative w-full group">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </span>
              <input
                type="text"
                placeholder="Search projects, documents, team members..."
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          <div className="ml-4 flex items-center space-x-5">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative transition-colors rounded-full hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>
            <div className="flex items-center space-x-3 border-l border-slate-200 pl-5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-none">{user?.full_name || 'User'}</p>
                <p className="text-xs text-indigo-600 font-medium mt-1">{user?.email || 'user@example.com'}</p>
              </div>
              <button className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full">
                <img
                  className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User avatar"
                />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Home;