import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './SignIn-SignUp.css';
import {Link, useNavigate} from 'react-router-dom';
import logo from "../assets/logo.png";
import {Button, IconButton, InputAdornment, TextField} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [validUsername, setValidUsername] = useState(true);


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
            console.log("Inicio de sesión exitoso:", response.data.token);
            navigate('/home');
        } catch (error) {
            console.error("Error de inicio de sesión:", error);
        }
    };

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handleUsernameChange(event) {
        setUsername(event.target.value);
        if (username.length > 15) {
            setValidUsername(false);
        } else {
            setValidUsername(true);
        }
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    useEffect(() => {
        localStorage.removeItem('token');
    }, []);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

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
                    className="wide-input"
                    value={email}
                    label={"Email"}
                    onChange={handleEmailChange}
                />
                <TextField
                    className="wide-input"
                    value={username}
                    label={"Username"}
                    onChange={handleUsernameChange}
                />
                <TextField
                    className="wide-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    label={"Password"}
                    onChange={handlePasswordChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleTogglePassword} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <Button variant="contained" type="submit" color="primary" disabled={!validUsername}>
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