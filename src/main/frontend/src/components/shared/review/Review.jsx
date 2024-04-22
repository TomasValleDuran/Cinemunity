import React, {useEffect, useState} from 'react';
import './Review.css';
import emptyHeart from '../../assets/empty-heart.png';
import filledHeart from '../../assets/filled-heart.png';
import star from '../../assets/golden_star.png';
import axios from "axios";
import trashIcon from '../../assets/trash-icon.png';
import PopUp from '../pop-up/PopUp';
import trashIconHover from '../../assets/new-open-trash-removebg-preview.png';

const Review = ({ id , username, reviewText, reviewRating, initialLikes, onRemoveReview }) => {
    const currentUsername = localStorage.getItem('username');
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes === undefined ? 0 : initialLikes);
    const rating = reviewRating;
    const [showPopUp, setShowPopUp] = useState(false);
    const [isHovered, setIsHovered] = useState(false); // Add this line


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

    const handleDeleteConfirm = () => {
        setShowPopUp(false); // Oculta el pop-up
        handleDelete(); // Llama a handleDelete solo si el usuario confirma la acción
    };

    const handleDeleteCancel = () => {
        setShowPopUp(false); // Oculta el pop-up si el usuario cancela la acción
    };

    return (
        <div className="review-container">
            <div className="review-header">
                <div className = "name-and-stars">
                    <h2>{username}</h2>
                    {Array.from({length: rating}).map((_, index) => <img key={index} src={star} alt={"rating"}/>)}
                </div>
                <div className={"review-trashIcon"}>
                    {currentUsername === username &&
                        <img
                            className="review-trashIcon"
                            src={isHovered ? trashIconHover : trashIcon} // Use isHovered to conditionally render the hover image
                            alt="delete"
                            onClick={() => setShowPopUp(true)}
                            onMouseEnter={() => setIsHovered(true)} // Set isHovered to true when the mouse enters the icon
                            onMouseLeave={() => setIsHovered(false)} // Set isHovered to false when the mouse leaves the icon
                        />
                    }
                </div>
            </div>
            <div className="review-body">
                <p>{reviewText}</p>
            </div>
            <div className="review-footer">
                <img src={liked ? filledHeart : emptyHeart} alt="like" onClick={handleLike}/>
                <p>Likes: {likes}</p>
            </div>
            {showPopUp && <PopUp onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel}/>}
        </div>
    );
};

export default Review;