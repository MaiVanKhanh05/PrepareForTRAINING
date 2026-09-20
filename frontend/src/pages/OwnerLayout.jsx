import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import OwnerSidebar from '../components/owner/OwnerSidebar';
import OwnerTopbar from '../components/owner/OwnerTopbar';

const OwnerLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans">
            <OwnerSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <OwnerTopbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-50 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default OwnerLayout;
