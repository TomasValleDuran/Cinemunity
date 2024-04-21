// ProtectedRoute.jsx
import React from 'react';
import {Navigate, useLocation, useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const ProtectedRoute = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const response = await axios.get('http://localhost:3333/api/user/currentUser', {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                setIsAdmin(response.data.is_admin);
            } catch (error) {
                console.error('Error checking admin status:', error);
            }
            setIsLoading(false);
        };

        checkAdminStatus();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAdmin) {
        // If the user is not an admin, redirect them to the error page
        return <Navigate to="/error" state={{ from: location }} replace />;
    }

    return children; // If the user is an admin, render the children components
};

export default ProtectedRoute;
