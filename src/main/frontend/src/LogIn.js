import React, {useState} from 'react';
import {Link} from "react-router-dom";
import axios from "axios";

function LogIn() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const handleChange = (event) => {
        setUser(event.target.value);
    };

    const handleChange1 = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

        try {
            const response = await axios.get('http://localhost:3333/api/user/signin', {
                params: {
                    username: user,
                    password: password
                }
            });
            console.log("res");
            console.log(response);
        } catch (error) {
            console.log("error");
            console.log(error);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Welcome to cinemunity</h1>
                <p>Log In</p>
                <form onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input type="text" value={user} onChange={handleChange} />
                    <p></p>
                    <label>Password</label>
                    <input type="text" value={password} onChange={handleChange1} />
                </form>
                <p></p>
                <button type="submit">Send</button>
                <p></p>
                <Link to="/">Todavia no tenes una cuenta?</Link>
            </header>
        </div>
    );
}

export default LogIn;