import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Calendar, Users, CheckCircle2, Clock,
    MoreVertical, Activity, LayoutGrid, Info, User
} from 'lucide-react';

function UserProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userid = payload.sub;
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    const getProjectById = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/projects/detail/${id}`, {
                headers: { Authorization: 'Bearer ' + token }
            });
            setProject(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Endpoint /api/projects/detail might not exist yet:", error);
            setLoading(false);
        }
    };

    const getTasksByProjectId = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/tasks/project/${id}`, {
                headers: { Authorization: 'Bearer ' + token }
            });
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        }
    };

    useEffect(() => {
        getProjectById();
        getTasksByProjectId();
    }, [id]);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutGrid },
        { id: 'tasks', label: 'My Tasks', icon: CheckCircle2 },
        { id: 'members', label: 'Members', icon: Users }
    ];

    console.log(project);


    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
    }

    if (!project) {
        return (
            <div className="bg-white rounded-2xl p-12 border border-zinc-200 shadow-sm text-center">
                <div className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-zinc-900 mb-2">Project Not Found</h3>
                <p className="text-zinc-500">The project you are looking for does not exist or you don't have access.</p>
                <button onClick={() => navigate('/home/projects')} className="mt-6 text-indigo-600 hover:text-indigo-700 font-medium">Go back to projects</button>
            </div>
        );
    }

    const myTasks = tasks.filter(t => t.assignedTo === userid);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50 rounded-full blur-3xl -ml-10 -mb-10 opacity-60"></div>

                <div className="relative z-10">
                    <button
                        onClick={() => navigate('/home/projects')}
                        className="flex items-center text-zinc-500 hover:text-zinc-900 transition-colors mb-6 group text-sm font-medium"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Projects
                    </button>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{project.name}</h1>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Active</span>
                            </div>
                            <p className="text-zinc-500 max-w-2xl text-lg leading-relaxed">
                                {project.description || "No description provided."}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-zinc-100">
                        <div className="flex items-center gap-2 text-zinc-600">
                            <div className="p-2 bg-zinc-100 rounded-lg"><Calendar className="h-4 w-4" /></div>
                            <div>
                                <p className="text-xs text-zinc-400 font-medium">Created On</p>
                                <p className="text-sm font-semibold">{new Date(project.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-600">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><CheckCircle2 className="h-4 w-4" /></div>
                            <div>
                                <p className="text-xs text-zinc-400 font-medium">My Progress</p>
                                <p className="text-sm font-semibold text-indigo-700">
                                    {myTasks.length > 0 ? Math.round((myTasks.filter(t => t.status === 'DONE').length / myTasks.length) * 100) : 0}% Completed
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-600">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><User className="h-4 w-4" /></div>
                            <div>
                                <p className="text-xs text-zinc-400 font-medium">Owner</p>
                                <p className="text-sm font-semibold text-orange-700">{project.ownerName}</p>
                            </div>
                        </div>

                        <div className="ml-auto flex -space-x-3">
                            {project.members && project.members.slice(0, 5).map((member) => (
                                <img
                                    key={member.id}
                                    src={member.avatar || `https://i.pravatar.cc/100?u=${member.memberId || member.id}`}
                                    alt={member.Name || "Member"}
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                                    title={member.Name}
                                />
                            ))}
                            {project.members && project.members.length > 5 && (
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-xs font-semibold text-zinc-600 z-10 shadow-sm">
                                    +{project.members.length - 5}
                                </div>
                            )}
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
                                <h2 className="text-lg font-bold text-zinc-900">Project Task Progress</h2>
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

                        {/* All Project Tasks */}
                        <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-zinc-900">All Project Tasks</h2>
                            </div>
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {tasks.length === 0 ? (
                                    <p className="text-zinc-500 text-sm">There are no tasks in this project yet.</p>
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

                                        return (
                                            <div key={task.id} onClick={() => navigate(`/home/projects/${id}/tasks/${task.id}`)} className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:shadow-sm transition-all bg-zinc-50/50 hover:bg-white group cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-xl bg-${color}-100 text-${color}-600`}>
                                                        <CheckCircle2 className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">{task.title}</p>
                                                        <p className="text-xs text-zinc-500 mt-0.5">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
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
                        <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                    <Info className="h-5 w-5 text-indigo-500" />
                                    About Project
                                </h2>
                            </div>
                            <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                                {project.description || "No description provided."}
                            </p>
                            <div className="space-y-4 pt-4 border-t border-zinc-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-500 text-sm">Status</span>
                                    <span className="text-emerald-600 font-medium text-sm">Active</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-500 text-sm">Total Tasks</span>
                                    <span className="text-zinc-900 font-medium text-sm">{tasks.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-500 text-sm">Team Size</span>
                                    <span className="text-zinc-900 font-medium text-sm">{project.memberCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
                <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-zinc-900">My Tasks</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myTasks.length === 0 ? (
                            <p className="text-zinc-500 text-sm col-span-3 text-center py-10">You don't have any tasks assigned in this project yet.</p>
                        ) : (
                            myTasks.map((task) => {
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
                                    <div key={task.id} onClick={() => navigate(`/home/projects/${id}/tasks/${task.id}`)} className="p-5 rounded-2xl border border-zinc-200 hover:border-indigo-300 hover:shadow-md transition-all bg-white group flex flex-col h-full cursor-pointer">
                                        <div className="flex items-start justify-between mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700 border border-${color}-200`}>
                                                {displayStatus}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg text-zinc-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{task.title}</h3>
                                        <p className="text-sm text-zinc-500 mb-4 line-clamp-3 flex-grow">{task.description}</p>

                                        <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                                                <Calendar className="h-4 w-4 text-zinc-400" />
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={`https://i.pravatar.cc/100?u=${task.assignedTo}`}
                                                    alt="Assignee Avatar"
                                                    className="w-6 h-6 rounded-full border border-zinc-200"
                                                />
                                                <span className="text-xs text-zinc-500 font-medium">You</span>
                                            </div>
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
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {project.members && project.members.map((member) => {
                            const isOwner = member.Name === project.ownerName;
                            return (
                                <div key={member.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isOwner ? 'border-red-300 bg-red-50/30 shadow-sm' : 'border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-zinc-200'
                                    }`}>
                                    <div className="relative">
                                        <img
                                            src={member.avatar || `https://i.pravatar.cc/100?u=${member.memberId || member.id}`}
                                            alt={member.Name || "Member"}
                                            className={`w-12 h-12 rounded-full border-2 shadow-sm ${isOwner ? 'border-red-500' : 'border-white'}`}
                                        />
                                        {isOwner && (
                                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                                ★
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className={`font-semibold truncate ${isOwner ? 'text-red-700' : 'text-zinc-900'}`} title={`Name: ${member.Name}`}>
                                                {member.Name}
                                            </p>
                                            {isOwner && <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">Owner</span>}
                                        </div>
                                        <p className="text-xs text-zinc-500 truncate mt-0.5">Joined: {new Date(member.joinedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProjectDetail;