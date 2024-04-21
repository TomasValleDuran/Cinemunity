import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import '../SignIn-SignUp.css'
import FormInput from "../../shared/form-input/FormInput";
import {SigninSignupButton} from "../../shared/buttons/Buttons";
import logo from "../../assets/logo.png";

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
        <div className="container">
            <div className='header'>
                <div className={'header-img'}>
                        <img src={logo} alt={'logo.png'}/>
                </div>
                <div className='title'>
                    <div className='tittle-text'>Log In</div>
                </div>
            </div>
            <form onSubmit={handleSignIn} className='inputs'>
                <FormInput type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                           placeholder="Username"/>
                <FormInput type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                           placeholder="Password"/>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <SigninSignupButton onClick={handleSignIn}>Sign In</SigninSignupButton>
            </form>
            <div className='link'>
            Don't have an account? <Link to={"/signup"}>Sign Up Here</Link>
            </div>
        </div>
    )
}
export default SignIn