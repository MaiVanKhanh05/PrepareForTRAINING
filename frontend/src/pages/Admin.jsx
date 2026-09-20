import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Topbar from '../components/admin/Topbar';


const Admin = () => {


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'ADMIN') {
            navigate('/login');
        }
    }, []);

    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-50 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Admin;