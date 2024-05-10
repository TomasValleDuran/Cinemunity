import React, { useState } from 'react';
import axios from 'axios';
import './SignIn-SignUp.css';
import {Link, useNavigate} from 'react-router-dom';
import logo from "../assets/logo.png";
import {Button, TextField} from "@mui/material";

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");


    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3333/api/user/signup', {
                username: username,
                email: email,
                password: password
            });
            console.log("res")
            console.log(response.data);
            await signIn();
        } catch (error) {
            if (error.response && error.response.data) {
                console.error(error.response.data, error);
                setErrorMessage(error.response.data);
            } else {
                console.error("Ocurrió un error, pero no se pudo obtener más información", error);
            }
        }
    };

    const signIn = async () => {
        try {
            const response = await axios.post(`http://localhost:3333/api/user/signin`, {
                username: username,
                password: password,
            });

            // Store the token in local storage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);
            console.log("Inicio de sesión exitoso:", response.data.token);
            navigate('/home');
        } catch (error) {
            console.error("Error de inicio de sesión:", error);
        }
    };

    function handleEmailChange(event) {
        setEmail(event.target.value)
    }

    function handleUsernameChange(event) {
        setUsername(event.target.value)
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value)
    }

    return (
        <div className="container-signin">
            <div className="header">
                <div className={'header-img'}>
                    <img src={logo} alt={'logo.png'}/>
                </div>
                <div className="title">
                    <div className="tittle-text">Sign Up</div>
                </div>
            </div>
            <form onSubmit={handleSignUp} className="inputs">
                <TextField
                    value={email}
                    label={"Email"}
                    onChange={handleEmailChange}
                />
                <TextField
                    value={username}
                    label={"Username"}
                    onChange={handleUsernameChange}
                />
                <TextField
                    type={"password"}
                    value={password}
                    label={"Password"}
                    onChange={handlePasswordChange}
                />
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <Button variant="contained" type="submit" color="primary">
                    Sign Up
                </Button>
            </form>
            <div className="link">
                Already have an account? <Link to={'/signin'}>Sign In Here</Link>
            </div>
        </div>
    );
};

export default SignUp;