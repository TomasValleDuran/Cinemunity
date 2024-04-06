import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import React from "react";
import './SignIn.css'
import axios from "axios";

const SignIn = ()=>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const handleSignIn = async () => {
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
        <div className="signin-container">
            <div className='signin-header'>
                <div className='signin-title'>
                    <div className='text'>Sign In</div>
                </div>
            </div>
            <div className='signin-inputs'>
                <div className='signin-input'>
                    <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className='signin-input'>
                    <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
            </div>
            <button className='signin-button' onClick={handleSignIn}>Sign In</button>
            <div className='signup'>
                Don't have an account? <Link to={"/signup"}>Sign Up Here</Link>
            </div>
        </div>
    )
}
export default SignIn