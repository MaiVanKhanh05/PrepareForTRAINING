import React, { useState } from 'react';
import { UserPlus, MoreVertical, Mail } from 'lucide-react';

const mockTeam = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Editor', joined: '2026-01-15', avatar: 'https://i.pravatar.cc/150?u=alice' },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', joined: '2026-03-22', avatar: 'https://i.pravatar.cc/150?u=bob' },
];

const Team = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Team Members</h1>
          <p className="text-zinc-500 mt-1">Invite colleagues and manage their access levels.</p>
        </div>
        <button 
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-indigo-200"
        >
          <UserPlus className="h-5 w-5" />
          Invite Member
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-sm font-medium">
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {mockTeam.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full object-cover border border-zinc-200" />
                      <div>
                        <div className="font-medium text-zinc-900">{member.name}</div>
                        <div className="text-sm text-zinc-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {member.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-400 hover:text-zinc-600 p-2 rounded-lg hover:bg-zinc-100 transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isInviteOpen && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900">Invite Team Member</h2>
              <p className="text-zinc-500 text-sm mt-1">Send an invitation email to add someone to your team.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
                <input type="email" className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="colleague@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Role</label>
                <select className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white">
                  <option>Viewer</option>
                  <option>Editor</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
              <button onClick={() => setIsInviteOpen(false)} className="px-4 py-2 text-zinc-600 font-medium hover:bg-zinc-200/50 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => setIsInviteOpen(false)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm shadow-indigo-200">Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
