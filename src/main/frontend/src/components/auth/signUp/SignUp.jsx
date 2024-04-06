import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import {Link, useNavigate} from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            const response = await axios.post('/user/signup', {
                username: username,
                email: email,
                password: password
            });
            console.log("res")
            console.log(response.data);

            await signIn();
        } catch (error) {
            console.error('Error al enviar solicitud:', error);
        }
    };

    const signIn = async () => {
        try {
            const response = await axios.post(`/user/signin`, {
                username: username,
                password: password,
            });
            console.log("res")
            console.log(response.data);
            navigate('/home');
        } catch (error) {
            console.error("Error de inicio de sesión:", error);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-header">
                <div className="signup-title">
                    <div className="text"> Sign Up </div>
                </div>
            </div>
            <div className="signup-inputs">
                <div className="signup-input">
                    <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                </div>
                <div className="signup-input">
                    <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                </div>
                <div className="signup-input">
                    <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                </div>
            </div>
            <button className="signup-button" onClick={handleSignUp}>Sign Up</button>
            <div className="login">
                Already have an account? <Link to={'/signin'}>Sign In Here</Link>
            </div>
        </div>
    );
};

export default SignUp;