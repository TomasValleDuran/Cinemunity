import React, { useState } from 'react';
import {Button, IconButton, TextField} from '@mui/material';
import axios from 'axios';
import {useLocation, useNavigate} from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import withAuth from "../../hoc/withAuth";
import "./ModifyUser.css"

function ModifyUser() {
    const location = useLocation();
    const { username: initialUsername, email: initialEmail } = location.state;

    const [username, setUsername] = useState(initialUsername);
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

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
            navigate(`/user/${username}`)
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
                <IconButton aria-label="back" onClick={() => navigate(`/user/${username}`)}>
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