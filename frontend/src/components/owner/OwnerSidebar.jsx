import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Layout, Users, LogOut } from 'lucide-react';

const OwnerSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { name: 'Projects', path: '/owner/projects', icon: Layout },
    { name: 'Team', path: '/owner/team', icon: Users },
  ];

  return (
    <div className="w-64 bg-white border-r border-zinc-200 h-screen flex flex-col transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-zinc-200">
        <div className="flex items-center gap-2 text-indigo-600">
          <Layout className="h-6 w-6" />
          <span className="text-lg font-bold tracking-tight">OwnerPanel</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-zinc-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default OwnerSidebar;
