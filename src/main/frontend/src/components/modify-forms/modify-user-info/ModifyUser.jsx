import React, {useEffect, useState} from 'react';
import {Button, IconButton, TextField} from '@mui/material';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import withAuth from "../../hoc/withAuth";
import "./ModifyUser.css"

function ModifyUser() {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3333/api/user/currentUser`, {
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    });
                setUserId(response.data.userId);
                setUsername(response.data.username);
                setEmail(response.data.email);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [userId]);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const response = await axios.put('http://localhost:3333/api/user/updateUserInfo', {
                username,
                email,
                password
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("Updated user succesfully:", response.data);
            navigate(`/user/${userId}`)
        } catch (error) {
            if (error.response && error.response.data) {
                console.error(error.response.data, error);
                setErrorMessage(error.response.data);
            } else {
                console.error("Ocurrió un error, pero no se pudo obtener más información", error);
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
                    <div className="tittle-text">Modify Account Information</div>
                </div>
            </div>
            <form onSubmit={handleSubmit} className={"inputs"}>
                <TextField
                    type="username"
                    label="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    required={true}
                />
                <TextField
                    type="email"
                    label="Email"
                    value={email}
                    onChange={handleEmailChange}
                    required={true}
                />
                <TextField
                    label="Current Password"
                    value={password}
                    onChange={handlePasswordChange}
                    type="password"
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

const ProtectedModifyUser = withAuth(ModifyUser)
export default ProtectedModifyUser;