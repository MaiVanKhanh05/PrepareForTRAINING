import React, { useEffect, useState } from 'react';
import { Edit2, Eye, EyeDashed, Pointer, Trash2 } from 'lucide-react';
import axios from 'axios';


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  const getAllUser = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users',
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      console.log(response);
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUser();
  }, [])

  const handleEdit = (id) => {
    console.log(id);
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete('http://localhost:8080/api/users/delete/' + id,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }

      );

      await getAllUser();

    } catch (error) {
      console.log(error);
    }

  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">User Management</h1>
          <p className="text-zinc-500 mt-1">Manage your team members and their account permissions here.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-sm font-medium">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover border border-zinc-200" />
                      <div>
                        <div className="font-medium text-zinc-900">{user.name}</div>
                        <div className="text-sm text-zinc-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-zinc-600">{user.role}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" onClick={() => handleEdit(user.id)} />
                      </button>
                      <button className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" onClick={() => handleDelete(user.id)} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
