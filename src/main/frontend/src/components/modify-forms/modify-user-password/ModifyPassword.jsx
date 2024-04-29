import React, { useState } from 'react';
import {Button, IconButton, TextField} from '@mui/material';
import axios from 'axios';
import {useLocation, useNavigate} from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import withAuth from "../../hoc/withAuth";
import './ModifyPassword.css';

function ModifyPassword() {
    const location = useLocation();
    const { username } = location.state;

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleCurrentPasswordChange = (event) => {
        setCurrentPassword(event.target.value);
    };

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmNewPasswordChange = (event) => {
        setConfirmNewPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            if (newPassword !== confirmNewPassword) {
                setErrorMessage("New password and confirm new password do not match");
                return;
            }
            const response = await axios.put('http://localhost:3333/api/user/updatePassword', {
                currentPassword,
                newPassword
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("Updated password succesfully");
            navigate(`/user/${username}`)
        } catch (error) {
            if (error.response && error.response.data) {
                console.error(error.response.data, error);
                setErrorMessage(error.response.data);
            } else {
                console.error("An error occurred, but no further information could be retrieved", error);
            }
        }
    };

    return (
        <div className={"container"}>
            <div className={"back"}>
                <IconButton aria-label="back" onClick={() => navigate(`/user/${username}`)}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
            <div className={"header"}>
                <div className="title">
                    <div className="tittle-text">Modify Password</div>
                </div>
            </div>
            <form onSubmit={handleSubmit} className={"inputs"}>
                <TextField
                    type="password"
                    label="Current Password"
                    value={currentPassword}
                    onChange={handleCurrentPasswordChange}
                    required={true}
                />
                <TextField
                    type="password"
                    label="New Password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    required={true}
                />
                <TextField
                    type="password"
                    label="Confirm New Password"
                    value={confirmNewPassword}
                    onChange={handleConfirmNewPasswordChange}
                    required={true}
                />
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <Button variant="contained" type="submit" color="primary">
                    Confirm
                </Button>
            </form>
        </div>

    );
}

const ProtectedModifyPassword = withAuth(ModifyPassword);
export default ProtectedModifyPassword;