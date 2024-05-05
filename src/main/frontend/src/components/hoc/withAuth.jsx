import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const withAuth = WrappedComponent => {
    return (props) => {
        const navigate = useNavigate();
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            const token = localStorage.getItem('token');

            if (!token) {
                // If the token is not found, navigate to the sign-in page
                navigate('/signin');
            } else {
                // Validate the token
                axios.get('http://localhost:3333/api/user/validateToken', {
                    headers: {
                        'Authorization': token
                    }
                }).then(() => {
                    setIsLoading(false);
                }).catch(() => {
                    // If the token is invalid, remove it and navigate to the sign-in page
                    localStorage.removeItem('token');
                    navigate('/signin');
                });
            }
        }, []);

        // While the token is being validated, don't render the wrapped component
        if (isLoading) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;