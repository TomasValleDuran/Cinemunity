import React, {useEffect, useState} from 'react';
import './Show.css';
import {useParams} from "react-router-dom";
import Header from '../shared/header/Header';
import axios from "axios";
import AddReview from "../addForms/addReview/AddReview";

const Show = () => {

    const { title } = useParams();
    const [director, setDirector] = useState('');
    const [show_type, setShow_type] = useState('');
    const [description, setDescription] = useState('');
    const [actors, setActors] = useState([]);
    const [seasons, setSeasons] = useState('');
    const [showAddReview, setShowAddReview] = useState(false);

    const fetchShow = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/show/get/${title}`, {
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

    const handleShowAddReview = () => {
        setShowAddReview(true);
    }

    const handleShowRemoveReview = () => {
        setShowAddReview(false);
    }

    return (
        <div>
            <div className="home-container">
                <Header />
                <p> esta {show_type} se llama {title} </p>
                <p> esta dirigida por {director}</p>
                <p> esta protagonizada por {actors.join(", ")}</p>
                <p> {description}</p>
                {seasons.length > 0 && <p> seasons: {seasons[seasons.length - 1]}</p>}
            </div>
            <div>
                <h1>Comentarios</h1>
            </div>
            {showAddReview && <AddReview onRemove={handleShowRemoveReview} showTitle={title}/>}
            <div>
                <p>aca van los comentarios</p>
            </div>
            <button className="floating-button" onClick={handleShowAddReview}>+</button>
        </div>
    );
};

export default Show;