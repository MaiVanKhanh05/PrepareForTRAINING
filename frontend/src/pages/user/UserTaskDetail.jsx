import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, UploadCloud, Paperclip, FileText, CheckCircle2, Download } from 'lucide-react';
import { supabase } from '../../config/supabaseClient';

function UserTaskDetail() {
    const { projectId, taskId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [task, setTask] = useState(null);
    const [taskFiles, setTaskFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const fetchTaskFiles = async () => {
        try {
            const filesResponse = await axios.get(`http://localhost:8080/api/files/project/${projectId}`, {
                 headers: { Authorization: 'Bearer ' + token }
            });
            const filesForTask = filesResponse.data.filter(file => file.storedName && file.storedName.startsWith(`${taskId}/`));
            setTaskFiles(filesForTask);
        } catch (error) {
            console.error("Failed to fetch files", error);
        }
    };

    useEffect(() => {
        const getTaskDetail = async () => {
            try {
                // Fetch all project tasks and find the matching task
                const response = await axios.get(`http://localhost:8080/api/tasks/project/${projectId}`, {
                     headers: { Authorization: 'Bearer ' + token }
                });
                const foundTask = response.data.find(t => t.id === taskId);
                setTask(foundTask);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch task", error);
                setLoading(false);
            }
        };
        getTaskDetail();
        fetchTaskFiles();
    }, [projectId, taskId, token]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        try {
            const fileName = `${taskId}/${Date.now()}_${selectedFile.name}`;
            const { data, error } = await supabase.storage
                .from('project-files')
                .upload(fileName, selectedFile);
                
            if (error) {
                console.error("Upload error:", error);
                alert("Upload failed: " + error.message);
            } else {
                try {
                    await axios.post('http://localhost:8080/api/files/metadata', {
                        projectId: projectId,
                        originalName: selectedFile.name,
                        storedName: fileName,
                        filePath: `project-files/${fileName}`,
                        fileType: selectedFile.type || 'application/octet-stream',
                        fileSize: selectedFile.size
                    }, {
                        headers: { Authorization: 'Bearer ' + token }
                    });
                    alert(`Upload successful! File saved to Supabase and database.`);
                    setSelectedFile(null);
                    fetchTaskFiles();
                } catch (metaError) {
                    console.error("Failed to save metadata", metaError);
                    alert("File uploaded to Supabase, but failed to save metadata to the database.");
                }
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("An unexpected error occurred during upload.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownloadFile = async (file) => {
        try {
            const { data, error } = await supabase.storage
                .from('project-files')
                .download(file.storedName);
            if (error) {
                console.error("Download error:", error);
                alert("Download failed: " + error.message);
                return;
            }
            const url = URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.originalName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Unexpected error during download:", err);
            alert("Failed to download file.");
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
    }

    if (!task) {
        return (
            <div className="bg-white rounded-2xl p-12 border border-zinc-200 shadow-sm text-center">
                <h3 className="text-lg font-bold text-zinc-900 mb-2">Task Not Found</h3>
                <button onClick={() => navigate(`/home/projects/${projectId}`)} className="text-indigo-600 font-medium hover:underline">Go back to Project</button>
            </div>
        );
    }

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
        <div className="space-y-6 animate-in fade-in duration-500">
            <button
                onClick={() => navigate(`/home/projects/${projectId}`)}
                className="flex items-center text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium mb-2"
            >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Project
            </button>

            <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                     <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700 border border-${color}-200`}>
                        {displayStatus}
                    </span>
                    <h1 className="text-2xl font-bold text-zinc-900">{task.title}</h1>
                </div>
                
                <p className="text-zinc-600 leading-relaxed mb-6 whitespace-pre-wrap">
                    {task.description || "No description provided for this task."}
                </p>

                <div className="flex items-center gap-6 pt-6 border-t border-zinc-100">
                    <div className="flex items-center gap-2 text-zinc-600">
                        <div className="p-2 bg-zinc-100 rounded-lg">
                            <Calendar className="h-5 w-5 text-zinc-500" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-400 font-medium">Due Date</p>
                            <p className="text-sm font-semibold text-zinc-900">
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">
                <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <Paperclip className="h-5 w-5 text-indigo-500" />
                    Attachments & Uploads
                </h2>
                
                <div className="border-2 border-dashed border-zinc-300 rounded-2xl p-8 text-center bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer relative group">
                    <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        onChange={handleFileChange}
                    />
                    <UploadCloud className="h-10 w-10 text-indigo-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-zinc-700 font-medium mb-1">Click or drag file to this area to upload</p>
                    <p className="text-xs text-zinc-500">Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.</p>
                </div>

                {selectedFile && (
                    <div className="mt-6 bg-white border border-zinc-200 rounded-xl p-4 flex items-center justify-between shadow-sm animate-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-zinc-900 text-sm">{selectedFile.name}</p>
                                <p className="text-xs text-zinc-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleUpload}
                            disabled={isUploading}
                            className={`px-5 py-2 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm ${
                                isUploading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {isUploading ? 'Uploading...' : 'Upload File'}
                        </button>
                    </div>
                )}
                
                {/* Uploaded Files List */}
                {taskFiles.length > 0 && (
                    <div className="mt-8 border-t border-zinc-100 pt-6">
                        <h3 className="text-md font-bold text-zinc-900 mb-4">Uploaded Files</h3>
                        <div className="space-y-3">
                            {taskFiles.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-xl shadow-sm hover:border-indigo-200 transition-colors">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg flex-shrink-0">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-zinc-900 text-sm truncate" title={file.originalName}>{file.originalName}</p>
                                            <p className="text-xs text-zinc-500">{(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDownloadFile(file)}
                                        className="p-2 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex-shrink-0"
                                        title="Download"
                                    >
                                        <Download className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserTaskDetail;
