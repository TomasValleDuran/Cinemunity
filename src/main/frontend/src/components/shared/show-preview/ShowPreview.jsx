import React from 'react';
import {useNavigate} from "react-router-dom";
import './ShowPreview.css';

const ShowPreview = ({ id, title, image, rating, reviews }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/show/${id}`);
    }

    return (
        <div className="show-preview">
            <div className="show-image-preview" onClick={handleClick}>
                <img src={image} alt={title}/>
            </div>
        </div>
    );
}

export default ShowPreview;