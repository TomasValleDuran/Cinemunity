import React, {useEffect, useState} from 'react';
import './User.css';
import Header from '../shared/header/Header';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const User = () => {

    const [username, setUsername] = useState('');
    const [usermail, setUsermail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();


    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:3333/user/currentUser', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("información de user:", response.data)
            return response.data;
        } catch (error) {
            console.error('Error fetching username:', error);
            return null;
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await fetchUser();
            response && setUsername(response.username);
            response && setUsermail(response.email);
            response && setIsAdmin(response.is_admin);
        };

        fetchUserData();
    }, []);

    const handleMovieClick = () => {
        navigate(`/addMovie`);
    }

    return (
        <div>
            <Header />
            <h1>hola {username}</h1>
            <h2>tu mail es: {usermail}</h2>
            {isAdmin && <button onClick={handleMovieClick}>Agregar Peliculas</button>}

        </div>
    );
};

export default User;