import React, {useEffect, useState} from 'react';
import './Show.css';
import {useParams} from "react-router-dom";
import Header from '../shared/header/Header';
import axios from "axios";

const Show = () => {

    const { title } = useParams();
    const [director, setDirector] = useState('');
    const [show_type, setShow_type] = useState('');
    const [description, setDescription] = useState('');
    const [actors, setActors] = useState('');
    const [seasons, setSeasons] = useState('');

    const fetchShow = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/show/${title}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("información de show:", response.data)
            return response.data;
        }
        catch (error) {
            console.error('Error fetching show:', error);
            return null;
        }
    }

    useEffect(() => {
        const fetchShowData = async () => {
            const response = await fetchShow();
            response && setDirector(response.director);
            response && setShow_type(response.show_type);
            response && setDescription(response.description);
            response && setActors(response.actors);
            response && setSeasons(response.seasons);
        };

        fetchShowData();
    }, []);

    return (
        <div className="home-container">
            <Header />
            <p> esta {show_type} se llama {title} </p>
            <p> esta dirigida por {director}</p>
            <p> esta protagonizada por {actors}</p>
            <p> {description}</p>
            {seasons.length > 0 && <p> seasons: {seasons[seasons.length - 1]}</p>}
        </div>
    );
};

export default Show;