import React from "react";
import { useEffect } from "react";
import { Outlet, Link, Navigate } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../api/axiosClient";

const DefaultLayout = () => {
    const {user, setUser, token, setToken} = useStateContext();

    useEffect(() => {
        axiosClient.get('/user')
            .then((res) => {
                setUser(res.data);
            })
    }, [setUser]);

    if (!token) {
        return <Navigate to="/login" />
    }
    
    const handleLogout = (e) => {
        e.preventDefault();
        axiosClient.post('/logout')
            .then(() => {
                setUser(null);
                setToken(null);
            })
            .catch((err) => {
                console.error('Logout failed:', err);
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Navbar */}
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-indigo-600"><Link to="/">Chat System</Link></h1>
                <nav className="flex items-center justify-end space-x-4">
                    <span className="text-gray-700 font-semibold">@{user.name}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-md"
                    >
                        Logout
                    </button>
                </nav>
            </header>

            {/* Content */}
            <main className="flex-grow p-6">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white text-center p-4 shadow mt-auto">
                <p className="text-sm text-gray-500">&copy; 2025 ChatSystem. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default DefaultLayout;