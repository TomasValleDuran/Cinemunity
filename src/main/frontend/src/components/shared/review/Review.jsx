import React, {useEffect, useState} from 'react';
import './Review.css';
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ConfirmationDialog from "../confirmation-dialog/ConfirmationDialog";
import {useNavigate} from "react-router-dom";

const Review = ({ id , username, userId, reviewText, reviewRating, initialLikes, onRemoveReview }) => {
    const [currentUsername, setCurrentUsername] = useState("");
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes === undefined ? 0 : initialLikes);
    const rating = reviewRating;
    const [dialogOpen, setDialogOpen] = useState(false); // State for confirmation dialog
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);


    const fetchLikes = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/user/currentUser`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            setCurrentUsername(response.data.username);
            return response.data.likes;
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
    }

    useEffect(() => {
        getIsVerified();
        fetchLikes().then((likes) => {
            if (likes && likes.includes(id)) {
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
                window.location.reload()
            })
            .catch(error => {
                console.error('Error deleting review:', error);
            });
    };

    const getIsVerified = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/user/get/${userId}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            setIsVerified(response.data.is_verified);
        }
        catch (error) {
            console.error('Error getting user:', error);
        }

    }

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    // Close confirmation dialog
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleUserSearch = () => {
        navigate(`/user/${userId}`);
    }

    return (
        <div className="review-container">
            <div className="review-header">
                <div className = "name-and-stars">
                    <h2 onClick={handleUserSearch} className={"username"}>{username}</h2>
                    {isVerified && <CheckCircleIcon className={"verified-icon"}/>}
                    {Array.from({length: rating}).map((_, index) => <StarIcon key={index} className={"start-icon"}/>)}
                </div>
                <div>
                    {(currentUsername === username || currentUsername === "admin") &&
                        <IconButton aria-label="delete" className={"delete-icon"} onClick={handleDialogOpen}>
                            <DeleteIcon/>
                        </IconButton>
                    }
                </div>
            </div>
            <div className="review-body">
                <p>{reviewText}</p>
            </div>
            <div className="review-footer">
                <div className="like-container">
                    {liked
                        ? <FavoriteIcon className={"favorite-icon"} onClick={handleLike}/>
                        : <FavoriteBorderIcon className={"favorite-border-icon"} onClick={handleLike}/>
                    }
                </div>
                <p>{likes}</p>
            </div>
            <ConfirmationDialog open={dialogOpen} onClose={handleDialogClose} onConfirm={handleDelete}
                                information={"Review"} isAdmin={false}/>
        </div>
    );
};

export default Review;