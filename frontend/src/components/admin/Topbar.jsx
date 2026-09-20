import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';

const Topbar = () => {
  return (
    <div className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg">
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 cursor-pointer hover:ring-2 ring-indigo-500/20 transition-all">
          <User className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
