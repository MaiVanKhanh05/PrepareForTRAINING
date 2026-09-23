import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import UserSidebar from '../components/user/UserSidebar';
import UserTopbar from '../components/user/UserTopbar';

const UserLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
            }
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
    }, [navigate]);

    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans">
            <UserSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <UserTopbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-50 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserLayout;
