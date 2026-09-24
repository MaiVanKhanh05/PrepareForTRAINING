import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Users, CheckCircle2, Clock,
  MoreVertical, Activity, FileText, Settings, LayoutGrid,
  Plus, X, Mail
} from 'lucide-react';
import axios from 'axios';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitedEmails, setInvitedEmails] = useState([]);
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("TODO");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editTaskStatus, setEditTaskStatus] = useState("TODO");
  const [editTaskAssignee, setEditTaskAssignee] = useState("");
  const [editTaskDueDate, setEditTaskDueDate] = useState("");

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/tasks/create',
        {
          projectId: id,
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
          assignedTo: taskAssignee,
          dueDate: taskDueDate ? new Date(taskDueDate).toISOString() : null
        },
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      setShowNewTaskModal(false);
      setTaskTitle("");
      setTaskDescription("");
      setTaskStatus("TODO");
      setTaskAssignee("");
      setTaskDueDate("");
      getTasksByProjectId(id);
      alert("Task created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create task");
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description);
    setEditTaskStatus(task.status);
    setEditTaskAssignee(task.assignedTo || "");
    setEditTaskDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
    setShowEditTaskModal(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/tasks/${selectedTask.id}`,
        {
          title: editTaskTitle,
          description: editTaskDescription,
          status: editTaskStatus,
          assignedTo: editTaskAssignee,
          dueDate: editTaskDueDate ? new Date(editTaskDueDate).toISOString() : null
        },
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      setShowEditTaskModal(false);
      getTasksByProjectId(id);
      alert("Task updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${selectedTask.id}`,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      setShowEditTaskModal(false);
      getTasksByProjectId(id);
      alert("Task deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete task");
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();

    if (!inviteEmail || invitedEmails.includes(inviteEmail)) {
      alert("Invalid email");
      return;
    }

    try {
      await axios.post(
        'http://localhost:8080/api/projects/invite',
        {
          email: inviteEmail,
          projectId: id
        },
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );

      setInvitedEmails([...invitedEmails, inviteEmail]);
      setInviteEmail('');

    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }
  };
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];


  const getProjectById = async (id) => {
    try {
      const response = await axios.get('http://localhost:8080/api/projects/detail/' + id,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      console.log("projectDetail: ", response.data);
      setProject(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTasksByProjectId = async (id) => {
    try {
      const response = await axios.get('http://localhost:8080/api/tasks/project/' + id,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProjectById(id);
    getTasksByProjectId(id);
  }, [id]);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500">
        Loading project details...
      </div>
    );
  }

  console.log("project : ", project);
  console.log("task: ", tasks);


  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50 rounded-full blur-3xl -ml-10 -mb-10 opacity-60"></div>

        <div className="relative z-10">
          <button
            onClick={() => navigate('/owner/projects')}
            className="flex items-center text-zinc-500 hover:text-zinc-900 transition-colors mb-6 group text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </button>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{project.name || `Website Redesign ${id}`}</h1>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Active</span>
              </div>
              <p className="text-zinc-500 max-w-2xl text-lg leading-relaxed">
                {project.description || "Revamping the corporate website to improve user experience and increase conversion rates with a modern tech stack."}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 px-4 py-2 rounded-xl font-medium transition-colors shadow-sm"
              >
                <Users className="h-4 w-4" />
                Invite
              </button>
              <button
                onClick={() => setShowNewTaskModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-medium transition-all shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4" />
                New Task
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-zinc-100">
            <div className="flex items-center gap-2 text-zinc-600">
              <div className="p-2 bg-zinc-100 rounded-lg"><Calendar className="h-4 w-4" /></div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">Due Date</p>
                <p className="text-sm font-semibold">N/A</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><CheckCircle2 className="h-4 w-4" /></div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">Progress</p>
                <p className="text-sm font-semibold text-indigo-700">
                  {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100) : 0}% Completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Clock className="h-4 w-4" /></div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">Time Tracking</p>
                <p className="text-sm font-semibold text-orange-700">124h Logged</p>
              </div>
            </div>

            <div className="ml-auto flex -space-x-3">
              {project.members && project.members.map((member) => (
                <img
                  key={member.id}
                  src={member.avatar || `https://i.pravatar.cc/100?u=${member.memberId || member.id}`}
                  alt={member.name || "Member"}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-xs font-semibold text-zinc-600 z-10 shadow-sm">
                +3
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${isActive
                ? 'bg-zinc-900 text-white shadow-md'
                : 'bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border border-transparent hover:border-zinc-200'
                }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-zinc-300' : 'text-zinc-400'}`} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-zinc-900">Task Progress</h2>
                <button className="text-zinc-400 hover:text-zinc-600"><MoreVertical className="h-5 w-5" /></button>
              </div>

              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                  <p className="text-zinc-500 text-sm font-medium mb-1">To Do</p>
                  <p className="text-2xl font-bold text-zinc-900">{tasks.filter(t => t.status === 'TODO').length}</p>
                </div>
                <div className="flex-1 bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <p className="text-blue-600 text-sm font-medium mb-1">In Progress</p>
                  <p className="text-2xl font-bold text-blue-700">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</p>
                </div>
                <div className="flex-1 bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                  <p className="text-emerald-600 text-sm font-medium mb-1">Completed</p>
                  <p className="text-2xl font-bold text-emerald-700">{tasks.filter(t => t.status === 'DONE').length}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-zinc-700">Overall Completion</span>
                  <span className="font-bold text-indigo-600">
                    {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100) : 0}%` }}></div>
                </div>
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-zinc-900">Recent Tasks</h2>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
              </div>
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <p className="text-zinc-500 text-sm">No tasks found. Create one above.</p>
                ) : (
                  tasks.slice(0, 5).map((task) => {
                    let color = 'zinc';
                    let displayStatus = 'To Do';
                    if (task.status === 'IN_PROGRESS') {
                      color = 'blue';
                      displayStatus = 'In Progress';
                    } else if (task.status === 'DONE') {
                      color = 'emerald';
                      displayStatus = 'Completed';
                    }

                    return (
                      <div key={task.id} onClick={() => handleTaskClick(task)} className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:shadow-sm transition-all bg-zinc-50/50 hover:bg-white group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl bg-${color}-100 text-${color}-600`}>
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">{task.title}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">Created on {new Date(task.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700 border border-${color}-200`}>
                          {displayStatus}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Sidebar (1/3 width) */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-500" />
                  Recent Activity
                </h2>
              </div>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
                {[
                  { user: 'Sarah M.', action: 'completed task', target: 'Homepage Layout', time: '2h ago' },
                  { user: 'Mike T.', action: 'uploaded file', target: 'design-specs.pdf', time: '4h ago' },
                  { user: 'You', action: 'added a comment to', target: 'API Routes', time: '5h ago' }
                ].map((activity, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-start gap-4 w-full relative z-10 pl-2">
                      <img src={`https://i.pravatar.cc/100?img=${idx + 10}`} alt="" className="w-8 h-8 rounded-full ring-4 ring-white shadow-sm" />
                      <div>
                        <p className="text-sm text-zinc-800">
                          <span className="font-semibold text-zinc-900">{activity.user}</span> {activity.action} <span className="font-medium text-indigo-600">{activity.target}</span>
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900">All Tasks</h2>
            <button
              onClick={() => { setShowNewTaskModal(true) }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-medium transition-all shadow-md shadow-indigo-200"
            >
              <Plus className="h-4 w-4" />
              New Task
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.length === 0 ? (
              <p className="text-zinc-500 text-sm col-span-3 text-center py-10">No tasks found. Create one above.</p>
            ) : (
              tasks.map((task) => {
                let color = 'zinc';
                let displayStatus = 'To Do';
                if (task.status === 'IN_PROGRESS') {
                  color = 'blue';
                  displayStatus = 'In Progress';
                } else if (task.status === 'DONE') {
                  color = 'emerald';
                  displayStatus = 'Completed';
                }

                const assignee = project.members?.find(m => m.memberId === task.assignedTo || m.id === task.assignedTo);

                return (
                  <div key={task.id} onClick={() => handleTaskClick(task)} className="cursor-pointer p-5 rounded-2xl border border-zinc-200 hover:border-indigo-300 hover:shadow-md transition-all bg-white group flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700 border border-${color}-200`}>
                        {displayStatus}
                      </span>
                      <button className="text-zinc-400 hover:text-zinc-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                    <h3 className="font-bold text-lg text-zinc-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{task.title}</h3>
                    <p className="text-sm text-zinc-500 mb-4 line-clamp-3 flex-grow">{task.description}</p>

                    <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                        <Calendar className="h-4 w-4 text-zinc-400" />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                      </div>
                      {assignee && (
                        <div className="flex items-center gap-2" title={`Assigned to ${assignee.Name}`}>
                          <img src={`https://i.pravatar.cc/100?u=${assignee.memberId || assignee.id}`} alt="Assignee" className="w-6 h-6 rounded-full border border-zinc-200" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900">Project Members ({project.members?.length || 0})</h2>
            <button
              onClick={() => { setShowInviteModal(true) }}
              className="flex items-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 px-5 py-2 rounded-xl font-medium transition-all shadow-sm"
            >
              <Users className="h-4 w-4" />
              Invite Member
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.members && project.members.map((member) => (
              <div key={member.id} className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-zinc-200 transition-all">
                <img
                  src={member.avatar || `https://i.pravatar.cc/100?u=${member.memberId || member.id}`}
                  alt={member.Name || "Member"}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-900 truncate" title={`Name: ${member.Name}`}>
                    {member.Name}
                  </p>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">Joined: {new Date(member.joinedAt).toLocaleDateString()}</p>
                </div>
                <button className="text-zinc-400 hover:text-zinc-600 p-2">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">Create New Task</h2>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors p-2 hover:bg-zinc-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="p-6 space-y-5" onSubmit={handleCreateTask}>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g., Update landing page copy"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Description</label>
                <textarea
                  rows="3"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Add details about this task..."
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Status</label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Assignee</label>
                  <select
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white"
                  >
                    <option value="">Unassigned</option>
                    {project.members && project.members.map(member => (
                      <option key={member.id} value={member.memberId || member.id}>
                        {member.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-5 py-2.5 text-zinc-600 font-medium hover:bg-zinc-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-200"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditTaskModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">Edit Task</h2>
              <button
                onClick={() => setShowEditTaskModal(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors p-2 hover:bg-zinc-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="p-6 space-y-5" onSubmit={handleUpdateTask}>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Task Title</label>
                <input
                  type="text"
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                  placeholder="e.g., Update landing page copy"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Description</label>
                <textarea
                  rows="3"
                  value={editTaskDescription}
                  onChange={(e) => setEditTaskDescription(e.target.value)}
                  placeholder="Add details about this task..."
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Status</label>
                  <select
                    value={editTaskStatus}
                    onChange={(e) => setEditTaskStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Assignee</label>
                  <select
                    value={editTaskAssignee}
                    onChange={(e) => setEditTaskAssignee(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white"
                  >
                    <option value="">Unassigned</option>
                    {project.members && project.members.map(member => (
                      <option key={member.id} value={member.memberId || member.id}>
                        {member.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={editTaskDueDate}
                  onChange={(e) => setEditTaskDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3 justify-between items-center">
                <button
                  type="button"
                  onClick={handleDeleteTask}
                  className="px-5 py-2.5 text-red-600 bg-red-50 font-medium hover:bg-red-100 rounded-xl transition-colors"
                >
                  Delete Task
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditTaskModal(false)}
                    className="px-5 py-2.5 text-zinc-600 font-medium hover:bg-zinc-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">Invite Team Members</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors p-2 hover:bg-zinc-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <form onSubmit={handleInvite}>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Email Address</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-200 whitespace-nowrap"
                  >
                    Send Invite
                  </button>
                </div>
              </form>

              <div>
                <h3 className="text-sm font-semibold text-zinc-700 mb-3">Invited Members</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {invitedEmails.length === 0 ? (
                    <p className="text-sm text-zinc-500 italic">No members invited yet.</p>
                  ) : (
                    invitedEmails.map((email, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 bg-zinc-50">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            {email.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-zinc-700">{email}</span>
                        </div>
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">Pending</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex justify-end">
              <button
                onClick={async () => {
                  setShowInviteModal(false);
                  setActiveTab('members');
                  await getProjectById(id);
                }}
                className="px-5 py-2 text-zinc-600 font-medium hover:bg-zinc-200 rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
};

export default ProjectDetail;
