import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import {Link, useNavigate} from 'react-router-dom';
import FormInput from "../../shared/form-input/FormInput";

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inavlidMailError, setInvalidMailError] = useState(false);
    const [mailError, setMailError] = useState(false); // Add this line
    const [usernameError, setUsernameError] = useState(false);

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
            if (response.data === "Email is invalid") {
                setInvalidMailError(true);
                return;
            }
                else setInvalidMailError(false);

            if (response.data === "Email already in use") {
                setMailError(true);
                return;
            }
            else setMailError(false);

            if (response.data === "Username already in use") {
                setUsernameError(true);
                return;
            }
            else setUsernameError(false);


            await signIn();
        } catch (error) {
            console.error('Error al enviar solicitud:', error);
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

    return (
        <div className="signup-container">
            <div className="signup-header">
                <div className="signup-title">
                    <div className="text"> Sign Up </div>
                </div>
            </div>
            <div className="signup-inputs">
                <FormInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                {inavlidMailError && <div className="error-message">Invalid email</div>}
                {mailError && <div className="error-message">Email already in use</div>}
                <FormInput type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                {usernameError && <div className="error-message">Username already in use</div>}
                <FormInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            </div>
            <button className="signup-button" onClick={handleSignUp}>Sign Up</button>
            <div className="login">
                Already have an account? <Link to={'/signin'}>Sign In Here</Link>
            </div>
        </div>
    );
};

export default SignUp;