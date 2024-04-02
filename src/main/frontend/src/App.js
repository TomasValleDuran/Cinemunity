import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleChange = (event) => {
        setUser(event.target.value);
    };

    const handleChange1 = (event) => {
        setPassword(event.target.value);
    };

    const handleChange2 = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

        try {
            const response = await axios.post('http://localhost:3333/user/signup', {
                email: email,
                username: user,
                password: password
            });
            console.log(email);
            console.log(response);
        } catch (error) {
            console.log(email);
            console.log("error");
            console.log(error);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <p>Welcome to cinemunity</p>
                <form onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input type="text" value={user} onChange={handleChange} />
                    <label>Password</label>
                    <input type="text" value={password} onChange={handleChange1} />
                    <label>Email</label>
                    <input type="text" value={email} onChange={handleChange2} />
                    <button type="submit">Send</button>
                </form>
            </header>
        </div>
    );
}

export default App;