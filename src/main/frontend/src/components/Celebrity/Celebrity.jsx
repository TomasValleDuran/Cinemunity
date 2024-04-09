import React, {useEffect, useState} from 'react';
import './Celebrity.css';
import {useParams} from "react-router-dom";
import Header from '../shared/header/Header';
import axios from "axios";

const Celebrity = () => {

    const { celebrityName } = useParams();
    const [bio, setBio] = useState('');

    const fetchCelebrity = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/celebrity/${celebrityName}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("información de celebrity:", response.data)
            return response.data;
        }
        catch (error) {
            console.error('Error fetching celebrity:', error);
            return null;
        }

    }

    useEffect(() => {
        const fetchCelebrityData = async () => {
            const response = await fetchCelebrity();
            response && setBio(response.bio);
        };

        fetchCelebrityData();
    }, []);

    return (
        <div className="home-container">
            <Header />
            <h2> esto es una celebridad y se llama: {celebrityName}</h2>
            <h3>biografia: {bio}</h3>
        </div>
    );
};

export default Celebrity;