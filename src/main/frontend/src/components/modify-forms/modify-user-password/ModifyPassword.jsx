import React, {useEffect, useState} from 'react';
import {Button, IconButton, TextField, InputAdornment} from '@mui/material';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import withAuth from "../../hoc/withAuth";
import './ModifyPassword.css';

function ModifyPassword() {
    const [userId, setUserId] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);

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

    const handleTogglePassword1 = () => {
        setShowPassword1(!showPassword1);
    };

    const handleTogglePassword2 = () => {
        setShowPassword2(!showPassword2);
    };

    const handleTogglePassword3 = () => {
        setShowPassword3(!showPassword3);
    };

    return (
        <div className={"password-container"}>
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
                    type={showPassword1 ? 'text' : 'password'}
                    label="Current Password"
                    value={currentPassword}
                    onChange={handleCurrentPasswordChange}
                    required={true}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleTogglePassword1} edge="end">
                                    {showPassword1 ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    type={showPassword2 ? 'text' : 'password'}
                    label="New Password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    required={true}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleTogglePassword2} edge="end">
                                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    type={showPassword3 ? 'text' : 'password'}
                    label="Confirm New Password"
                    value={confirmNewPassword}
                    onChange={handleConfirmNewPasswordChange}
                    required={true}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleTogglePassword3} edge="end">
                                    {showPassword3 ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
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