import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import React from "react";
import './SignIn.css'
import axios from "axios";
import FormInput from "../../shared/form-input/FormInput";

const SignIn = ()=>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // Add this line

    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3333/api/user/signin`, {
                username: username,
                password: password,
            });

            localStorage.setItem('token', response.data.token);
            console.log("Token:", localStorage.getItem('token'));
            localStorage.setItem('username', username);
            console.log("Username:", localStorage.getItem('username'));
            console.log("Inicio de sesión exitoso:", response.data.token);
            navigate('/home');
        } catch (error) {
            console.error(error.response.data, error);
            setErrorMessage(error.response.data);
        }
    };

    return (
        <div className="signin-container">
            <div className='signin-header'>
                <div className='signin-title'>
                    <div className='sign-in-text'>Log In</div>
                </div>
            </div>
            <form onSubmit={handleSignIn} className='signin-inputs'>
                <FormInput type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                           placeholder="Username"/>
                <FormInput type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                           placeholder="Password"/>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button className='signin-button' onClick={handleSignIn}>Sign In</button>
            </form>
            <div className='signup-link'>
            Don't have an account? <Link to={"/signup"}>Sign Up Here</Link>
            </div>
        </div>
    )
}
export default SignIn