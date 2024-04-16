import React, { useState } from 'react';
import './Review.css';
import emptyHeart from '../../assets/empty-heart.png';
import filledHeart from '../../assets/filled-heart.png';

const Review = ({ username, reviewText, reviewRating, initialikes }) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(initialikes === undefined ? 0 : initialikes);
    const [rating, setRating] = useState(reviewRating);

    const handleLike = () => {
        setLiked(!liked);
        if (!liked) {
            setLikes(likes + 1);
        } else {
            setLikes(likes - 1);
        }
    };

    return (
        <div className="review-container">
            <div className="review-header">
                <h2>{username} - Rating: {rating}</h2> {/* Display the rating next to the username */}
            </div>
            <div className="review-body">
                <p>{reviewText}</p>
            </div>
            <div className="review-footer">
                <img src={liked ? filledHeart : emptyHeart} alt="like" onClick={handleLike} />
                <p>Likes: {likes}</p>
            </div>
        </div>
    );
};

export default Review;