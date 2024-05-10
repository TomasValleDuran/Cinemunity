import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import './SignIn-SignUp.css'
import logo from "../assets/logo.png";
import {Button, TextField} from "@mui/material";

const SignIn = ()=>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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
export default SignIn