import React, {useEffect, useState} from 'react';
import './Review.css';
import emptyHeart from '../../assets/empty-heart.png';
import filledHeart from '../../assets/filled-heart.png';
import star from '../../assets/golden_star.png';
import axios from "axios";
import trashIcon from '../../assets/trashCan.png';

const Review = ({ id , username, reviewText, reviewRating, initialLikes, onRemoveReview }) => {
    const currentUsername = localStorage.getItem('username');
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes === undefined ? 0 : initialLikes);
    const rating = reviewRating;


    const fetchLikes = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/user/getLikedReviews/${currentUsername}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            return response.data.likes;
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
    }

    useEffect(() => {
        fetchLikes().then((likes) => {
            if (likes.includes(id)) {
                setLiked(true);
            }
        });
    });

    const handleLike = () => {
        if (!liked) {
            axios.put(`http://localhost:3333/api/review/likeReview/${id}`, {}, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })
                .then(response => {
                    console.log("liked review", response.data)
                    setLikes(likes + 1);
                    setLiked(true);
                })
                .catch(error => {
                    console.error('Error liking review:', error);
                });
        } else {
            axios.put(`http://localhost:3333/api/review/unlikeReview/${id}`, {}, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })
                .then(response => {
                    console.log("unliked review", response.data)
                    setLikes(likes - 1);
                    setLiked(false);
                })
                .catch(error => {
                    console.error('Error unliking review:', error);
                });
        }
    };

    const handleDelete = () => {
        axios.delete(`http://localhost:3333/api/review/deleteReview/${id}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log(response.data);
                onRemoveReview();
            })
            .catch(error => {
                console.error('Error deleting review:', error);
            });
    };

    return (
        <div className="review-container">
            <div className="review-header">
                <h2>{username}</h2>
                {Array.from({length: rating}).map((_, index) => <img key={index} src={star} alt={"rating"}/>)}
                {currentUsername === username && <img className="review-trashIcon" src={trashIcon} alt="delete" onClick={handleDelete} />}
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