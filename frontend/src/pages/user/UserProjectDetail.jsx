import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Users, Info, Folder } from 'lucide-react';

function UserProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userid = payload.sub;
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const getProjectById = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/projects/detail/${id}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );
            setProject(response.data);
            setLoading(false);
        } catch (error) {
            console.log("Endpoint /api/projects/detail might not exist yet:", error);
            setLoading(false);
        }
    };

    console.log(project);


    useEffect(() => {
        getProjectById();
    }, [id]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
    }

    if (!project) {
        return (
            <div className="bg-white rounded-2xl p-12 border border-zinc-200 shadow-sm text-center">
                <Folder className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-zinc-900 mb-2">Project Not Found</h3>
                <p className="text-zinc-500">The project you are looking for does not exist or you don't have access.</p>
                <button onClick={() => navigate('/home/projects')} className="mt-6 text-indigo-600 hover:text-indigo-700 font-medium">Go back to projects</button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2">
                <button
                    onClick={() => navigate('/home/projects')}
                    className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-zinc-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">{project.name}</h1>
                    <p className="text-zinc-500 mt-1">Project Details and Information</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-zinc-900">
                            <Info className="h-5 w-5 text-indigo-600" />
                            <h2 className="text-lg font-semibold">Description</h2>
                        </div>
                        <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">
                            {project.description || "No description provided."}
                        </p>
                    </div>

                    {/* Members List */}
                    {project.members && project.members.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-zinc-900">
                                    <Users className="h-5 w-5 text-indigo-600" />
                                    <h2 className="text-lg font-semibold">Members List</h2>
                                </div>
                                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                                    {project.members.length} members
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {project.members.map((member, index) => (
                                    <div key={member.id || index} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                        <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold shrink-0">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-zinc-900 truncate" title={`User Name: ${member.Name}`}>
                                                {member.Name}
                                            </p>
                                            <p className="text-xs text-zinc-500 truncate">Joined: {formatDate(member.joinedAt)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Meta Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Project Information</h2>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                    <User className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-500">Owner</p>
                                    <p className="text-zinc-900 font-medium mt-0.5">{project.ownerName}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-500">Created At</p>
                                    <p className="text-zinc-900 font-medium mt-0.5">{formatDate(project.createdAt)}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                    <Users className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-500">Total Members</p>
                                    <p className="text-zinc-900 font-medium mt-0.5">{project.memberCount} members</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProjectDetail