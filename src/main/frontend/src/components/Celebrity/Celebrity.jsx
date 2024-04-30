import React, {useEffect, useState} from 'react';
import './Celebrity.css';
import {useParams} from "react-router-dom";
import Header from '../shared/header/Header';
import axios from "axios";
import withAuth from "../hoc/withAuth";

const Celebrity = () => {

    const { celebrityId } = useParams();
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');

    const fetchCelebrity = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/celebrity/get/${celebrityId}`, {
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
            response && setName(response.name);
        };

        fetchCelebrityData();
    }, [fetchCelebrity]);

    return (
        <div className="home-container">
            <Header />
            <h2> esto es una celebridad y se llama: {name}</h2>
            <h3>biografia: {bio}</h3>
        </div>
    );
};

const ProtectedCelebrity = withAuth(Celebrity);
export default ProtectedCelebrity;