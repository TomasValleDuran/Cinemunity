import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = WrappedComponent => {
    return (props) => {
        const navigate = useNavigate();
        //validate if the user is logged in

        useEffect(() => {
            const token = localStorage.getItem('token');

            if (!token) {
                // If the token is not found, navigate to the sign-in page
                navigate('/signin');
            }
        }, []);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;