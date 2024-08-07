import React, {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import './SignIn-SignUp.css'
import logo from "../assets/logo.png";
import {Button, IconButton, InputAdornment, TextField} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

const SignIn = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3333/api/user/signin`, {
                username: username,
                password: password,
            });

            localStorage.setItem('token', response.data.token);
            console.log("Inicio de sesión exitoso:", response.data.token);
            navigate('/home');
        } catch (error) {
            console.error(error.response.data, error);
            setErrorMessage(error.response.data);
        }
    };

    function handleUsernameChange(event) {
        setUsername(event.target.value)
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value)
    }

    useEffect(() => {
        localStorage.removeItem('token');
    }, []);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="container-signin">
            <div className='header'>
                <div className={'header-img'}>
                    <img src={logo} alt={'logo.png'}/>
                </div>
                <div className='title'>
                    <div className='tittle-text'>Log In</div>
                </div>
            </div>
            <form onSubmit={handleSignIn} className='inputs'>
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
                <Button variant="contained" type="submit" color="primary">
                    Log In
                </Button>
            </form>
            <div className='link'>
                Don't have an account? <Link to={"/signup"}>Sign Up Here</Link>
            </div>
            <div className='link'>
                Forgot your password? <Link to={"/forgotpassword"}>Recover Password</Link>
            </div>
        </div>
    )
}

export default SignIn;