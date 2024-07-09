import React, {useEffect, useState} from 'react';
import ReactMarkdown from "react-markdown";
import './ReviewPreview.css';
import axios from "axios";
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {Link, useNavigate} from "react-router-dom";
import TwitterShareButton from "../share-button/TwitterShareButton";

const Review = ({ id , username, userId, reviewText, reviewRating, initialLikes, showId, image }) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes === undefined ? 0 : initialLikes);
    const rating = reviewRating;
    const navigate = useNavigate();

    const [title, setTitle] = useState("");

    const fetchShow = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/show/get/${showId}`, {
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
        fetchShow().then((show) => {
            if (show) {
                setTitle(show.title);
            }
        });
    }, []);


    const fetchLikes = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/user/currentUser`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log(response.data);
            return response.data.likes;
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
    }

    useEffect(() => {
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

    const handleUserSearch = () => {
        navigate(`/user/${userId}`);
    }

    const unmarkdownText = (text) => {
        return text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    }

    return (
        <div className="review-preview-container">
            <div className={"review-preview-image"}>
                <Link to={`/show/${showId}`}>
                    <img src={image} alt={username} className="review-image"/>
                </Link>
            </div>
            <div className={"review-content"}>
                <div className="review-header">
                    <div className="name-and-stars">
                        <h2 onClick={handleUserSearch} className={"username"}>{username}</h2>
                        {Array.from({length: rating}).map((_, index) => <StarIcon key={index}
                                                                                  className={"start-icon"}/>)}
                    </div>
                </div>
                <div className="review-body">
                    <ReactMarkdown>
                        {reviewText}
                    </ReactMarkdown>
                </div>
                <div className="review-footer">
                    <div className={"share-buttons"}>
                        <TwitterShareButton
                            review={unmarkdownText(reviewText)}
                            title={title}
                            username={username}/>
                    </div>
                    <div className="like-container">
                        {liked
                            ? <FavoriteIcon className={"favorite-icon"} onClick={handleLike}/>
                            : <FavoriteBorderIcon className={"favorite-border-icon"} onClick={handleLike}/>
                        }
                        <p>{likes}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Review;