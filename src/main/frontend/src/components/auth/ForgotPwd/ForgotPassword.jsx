import React from "react";
import {Link} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import '../SignIn-SignUp.css'
import {FormInput, SendFormButton} from "../../shared/form-input/FormInput";
import logo from "../../assets/logo.png";


const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const sendEmail = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`http://localhost:3333/api/user/forgotpassword`, {
                email: email,
            });
            console.log("Email enviado:", response.data);
            setError(response.data);
            setSuccess(true);
        } catch (error) {
            if (error.response && error.response.data) {
                console.error(error.response.data, error);
                setError(error.response.data);
            }
        }
    }
    return (
        <div className="container">
            <div className='header'>
                <div className={'header-img'}>
                    <img src={logo} alt={'logo.png'}/>
                </div>
                <div className='title'>
                    <div className='tittle-text'>Forgot Password</div>
                </div>
            </div>
            {!success &&
                <form className='inputs'>
                    <FormInput placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <SendFormButton onClick={(e) => sendEmail(e)}>Send Email</SendFormButton>
                    {error && <div className="error-message">{error}</div>}
                </form>
            }
            {success &&
                <div className="success-message">An email has been sent to {email} with instructions to reset your password</div>
            }
            <div className='link'>
                <Link to={"/signin"}>Back to Sign In</Link>
            </div>
        </div>
    )
}
export default ForgotPassword