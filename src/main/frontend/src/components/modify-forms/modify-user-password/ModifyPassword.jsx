import React, {useEffect, useState} from 'react';
import {Button, IconButton, TextField} from '@mui/material';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import withAuth from "../../hoc/withAuth";
import './ModifyPassword.css';

function ModifyPassword() {
    const [userId, setUserId] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentUserId = async () => {
            try {
                const response = await axios.get('http://localhost:3333/api/user/currentUser', {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                setUserId(response.data.userId);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchCurrentUserId();
    }, []);

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
            await axios.put('http://localhost:3333/api/user/updatePassword', {
                currentPassword,
                newPassword
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("Updated password succesfully");
            navigate(`/user/${userId}`)
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
                <IconButton aria-label="back" onClick={() => navigate(`/user/${userId}`)}>
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