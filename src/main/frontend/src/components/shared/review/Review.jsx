import React, {useEffect, useState} from 'react';
import ReactMarkdown from "react-markdown";
import './Review.css';
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReplyIcon from '@mui/icons-material/Reply';
import ConfirmationDialog from "../confirmation-dialog/ConfirmationDialog";
import TwitterShareButton from "../share-button/TwitterShareButton";
import {useNavigate} from "react-router-dom";
import AddReply from "../../add-forms/addReply/AddReply";
import Reply from "../reply/Reply";

const Review = ({ id , username, userId, reviewText,
                    reviewRating, initialLikes, onRemoveReview, title, repliesIds, onReplyChange }) => {
    const [currentUsername, setCurrentUsername] = useState("");
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes === undefined ? 0 : initialLikes);
    const rating = reviewRating;
    const [dialogOpen, setDialogOpen] = useState(false); // State for confirmation dialog
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);
    const [showReply, setShowReply] = useState(false);
    const [replies, setReplies] = useState(null);


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

    const fetchReplies = async () => {
        try {
            const response = await axios.post(`http://localhost:3333/api/review/getReplies`, repliesIds, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("replies fetched for Review: ", response.data);
            return response.data
        }
        catch (error) {
            console.error('Error fetching replies:', error);
        }

    }

    useEffect( () => {
        getIsVerified();

        fetchLikes().then((likes) => {
            if (likes && likes.includes(id)) {
                setLiked(true);
            }
        });
        if (repliesIds.length > 0) {
            fetchReplies().then((res) => {
                setReplies(res);
                console.log("replies", res)
            });
        }
    }, [repliesIds]);


    const handleReplyAdded = () => {
        onReplyChange();
        fetchReplies().then((res) => {
            setReplies(res);
            console.log("Replies after adding a new one:", res);
        });
    };

    useEffect(() => {
        fetchReplies().then((res) => {
            setReplies(res);
            console.log("replies", res)
        });
    }, [showReply]);

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
                //window.location.reload()
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

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleUserSearch = () => {
        navigate(`/user/${userId}`);
    }

    const unmarkdownText = (text) => {
        return text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    }

    const handleReply = () => {
        setShowReply(!showReply);
    }

    return (
        <div className="review-container">
            <div className="review-header">
                <div className="name-and-stars">
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
                    {/*<FacebookShareButton
                            review={unmarkdownText(reviewText)}
                            title={title}
                            username={username}/> No esta bien implementado todavía*/}
                </div>
                <div className="like-container">
                    <ReplyIcon className={"reply-icon"} onClick={handleReply}/>
                    {liked
                        ? <FavoriteIcon className={"favorite-icon"} onClick={handleLike}/>
                        : <FavoriteBorderIcon className={"favorite-border-icon"} onClick={handleLike}/>
                    }
                    <p>{likes}</p>
                </div>
            </div>
            {showReply && <AddReply reviewId={id} userId={userId} onClose={handleReply} onReplyAdded={handleReplyAdded}/>}
            <div>
                {replies === null ? (
                    <div></div>
                ) : (
                    replies.map((reply) => (
                        <Reply
                            key={reply.replyId}
                            reply_text={reply.reply_text}
                            username={reply.username}
                            userId={reply.userId}
                        />
                    ))
                )}
            </div>
            <ConfirmationDialog open={dialogOpen} onClose={handleDialogClose} onConfirm={handleDelete}
                                information={"Review"} isAdmin={false}/>
        </div>
    );
};

export default Review;