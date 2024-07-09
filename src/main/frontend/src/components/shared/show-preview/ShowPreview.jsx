import React from 'react';
import {useNavigate} from "react-router-dom";
import './ShowPreview.css';

const ShowPreview = ({ id, title, image, rating }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/show/${id}`);
    }
    const trimmedRating = rating.toString().slice(0, 3);
    return (
        <div className="show-preview" onClick={handleClick}>
            <div className="show-image-preview">
                <img src={image} alt={title}/>
            </div>
            <div className="rating-preview">
                <div className="rating-circle">{rating.toFixed(1)}</div>
            </div>
        </div>
    );
}

export default ShowPreview;
