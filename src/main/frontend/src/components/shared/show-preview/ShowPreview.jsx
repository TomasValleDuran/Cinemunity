import React from 'react';
import {useNavigate} from "react-router-dom";
import './ShowPreview.css';

const ShowPreview = ({ id, title, image }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/show/${id}`);
    }

    return (
        <div className="show-preview" onClick={handleClick}>
            <div className="show-image-preview">
                <img src={image} alt={title}/>
            </div>
        </div>
    );
}

export default ShowPreview;