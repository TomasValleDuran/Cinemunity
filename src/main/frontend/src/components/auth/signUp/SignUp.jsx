import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import {Link, useNavigate} from 'react-router-dom';
import FormInput from "../../shared/form-input/FormInput";

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");


    const navigate = useNavigate();

    const handleSignUp = async () => {
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
            console.error(error.response.data, error);
            setErrorMessage(error.response.data);
        }
    };

    const signIn = async (e) => {
        e.preventDefault();
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

    return (
        <div className="signup-container">
            <div className="signup-header">
                <div className="signup-title">
                    <div className="sign-up-text">Sign Up</div>
                </div>
            </div>
            <form onSubmit={handleSignUp} className="signup-inputs">
                <FormInput type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                           placeholder="Email"/>
                <FormInput type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                           placeholder="Username"/>
                <FormInput type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                           placeholder="Password"/>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button className="signup-button" onClick={handleSignUp}>Sign Up</button>
            </form>
            <div className="signin-link">
                Already have an account? <Link to={'/signin'}>Sign In Here</Link>
            </div>
        </div>
    );
};

export default SignUp;