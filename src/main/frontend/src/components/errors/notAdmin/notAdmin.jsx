import React from 'react';
import './notAdmin.css';
import {SaveButton} from '../../shared/buttons/Buttons';
import {useNavigate} from "react-router-dom";
import withAuth from '../../hoc/withAuth';

const NotAdmin = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate(`/home`);
    };

    return (
        <div className="not-admin-container">
            <h1>Access Denied</h1>
            <p>You do not have the necessary admin privileges to access this page.</p>
            <SaveButton onClick={handleHomeClick}> Home </SaveButton>
        </div>
    );
}

const ProtectedCelebrity = withAuth(NotAdmin);
export default ProtectedCelebrity;