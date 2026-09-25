import React, { useState, useEffect } from 'react';
import { UserPlus, MoreVertical, Mail, Folder } from 'lucide-react';
import axios from 'axios';

const Team = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [members, setMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/projects', {
          headers: { Authorization: 'Bearer ' + token }
        });
        setProjects(response.data);
        if (response.data.length > 0) {
          setSelectedProjectId(response.data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    fetchProjects();
  }, [token]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!selectedProjectId) {
        setMembers([]);
        return;
      }
      try {
        const response = await axios.get('http://localhost:8080/api/projects/detail/' + selectedProjectId, {
          headers: { Authorization: 'Bearer ' + token }
        });
        if (response.data && response.data.members) {
          setMembers(response.data.members);
        } else {
          setMembers([]);
        }
      } catch (error) {
        console.error("Failed to fetch project details", error);
        setMembers([]);
      }
    };
    fetchMembers();
  }, [selectedProjectId, token]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail || !selectedProjectId) {
      alert("Invalid email or no project selected");
      return;
    }
    try {
      await axios.post(
        'http://localhost:8080/api/projects/invite',
        { email: inviteEmail, projectId: selectedProjectId },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      alert("Invitation sent successfully!");
      setInviteEmail('');
      setIsInviteOpen(false);
      
      // Optionally refresh members
      const response = await axios.get('http://localhost:8080/api/projects/detail/' + selectedProjectId, {
        headers: { Authorization: 'Bearer ' + token }
      });
      if (response.data && response.data.members) {
        setMembers(response.data.members);
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Team Members</h1>
          <p className="text-zinc-500 mt-1">Manage team members by project.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Folder className="h-4 w-4 text-zinc-400" />
            </div>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="pl-10 pr-8 py-2 w-full sm:w-64 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white appearance-none"
            >
              <option value="">Select a project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => setIsInviteOpen(true)}
            disabled={!selectedProjectId}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-indigo-200"
          >
            <UserPlus className="h-5 w-5" />
            Invite Member
          </button>
        </div>
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
              {members.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-zinc-500">
                    No members found in this project.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={member.avatar || `https://i.pravatar.cc/100?u=${member.memberId || member.id}`} alt={member.Name} className="h-10 w-10 rounded-full object-cover border border-zinc-200" />
                        <div>
                          <div className="font-medium text-zinc-900">{member.Name || 'Unknown User'}</div>
                          <div className="text-sm text-zinc-500">{member.memberId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
                        Member
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={async () => {
                          if (window.confirm("Are you sure you want to remove this member from the project?")) {
                            try {
                              await axios.delete(`http://localhost:8080/api/projects/${selectedProjectId}/members/${member.memberId}`, {
                                headers: { Authorization: 'Bearer ' + token }
                              });
                              setMembers(members.filter(m => m.memberId !== member.memberId));
                              alert("Member removed successfully");
                            } catch (error) {
                              console.error(error);
                              alert("Failed to remove member");
                            }
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isInviteOpen && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <form onSubmit={handleInvite}>
              <div className="p-6 border-b border-zinc-100">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900">Invite Team Member</h2>
                <p className="text-zinc-500 text-sm mt-1">Send an invitation email to add someone to the current project.</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                    placeholder="colleague@company.com" 
                  />
                </div>
              </div>
              <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsInviteOpen(false)} className="px-4 py-2 text-zinc-600 font-medium hover:bg-zinc-200/50 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm shadow-indigo-200">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
