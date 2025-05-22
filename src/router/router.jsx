import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import DefaultLayout from '../components/Layouts/DefaultLayout.jsx';
import GuestLayout from '../components/Layouts/GuestLayout.jsx';
import Login from '../pages/Auth/Login.jsx';
import Register from '../pages/Auth/Register.jsx';
import ChatPage from '../pages/ChatPage.jsx';



const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <ChatPage />,
            },
        ]
    },

    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            },
        ]
    },
]);

export default router;