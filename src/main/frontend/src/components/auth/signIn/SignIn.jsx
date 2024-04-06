import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import React from "react";
import './SignIn.css'
import axios from "axios";
import FormInput from "../../shared/form-input/FormInput";

const SignIn = ()=>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const handleSignIn = async () => {
        try {
            const response = await axios.post(`http://localhost:3333/user/signin`, {
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
        <div className="signin-container">
            <div className='signin-header'>
                <div className='signin-title'>
                    <div className='text'>Sign In</div>
                </div>
            </div>
            <div className='signin-inputs'>
                <FormInput type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                <FormInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            </div>
            <button className='signin-button' onClick={handleSignIn}>Sign In</button>
            <div className='signup'>
                Don't have an account? <Link to={"/signup"}>Sign Up Here</Link>
            </div>
        </div>
    )
}
export default SignIn