import React, { useState, useEffect } from 'react';
import './AddReview.css';
import axios from "axios";
import withAuth from "../../hoc/withAuth";
import { Button, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Mention from "./Mention";

const AddReview = React.forwardRef(({ showTitle, showId , onRemove }, ref) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [myMap, setMyMap] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const [currentId, setCurrentId] = useState('');
    const [currentUsername, setCurrentUsername] = useState('');

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const updatedReview = await markdownTextifier();
            console.log(updatedReview);
            const response = await axios.post('http://localhost:3333/api/review/addReview', {
                review: updatedReview,
                rating: rating,
                show_title: showTitle
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("res");
            console.log(response.data);
            if (response.status === 200) {
                const usernames = extractUsernames(updatedReview);
                const message = `You were mentioned in a review for ${showTitle} by ${currentUsername}!`;
                await sendNotifications(usernames, message, currentId, showId);
                onRemove();
            }
        }
        catch (error) {
            console.error('Error al enviar solicitud:', error);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get('http://localhost:3333/api/user/currentUser', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log(response.data);
            setCurrentId(response.data.userId);
            setCurrentUsername(response.data.username);
        } catch (error) {
            console.error('Error getting current user:', error);
        }
    }

    const extractUsernames = (reviewText) => {
        const regex = /\@\[([^\]]+)\]\(http:\/\/localhost:3000\/user\/(\d+)\)/g;
        let matches;
        const usernamesSet = new Set();
        while ((matches = regex.exec(reviewText)) !== null) {
            usernamesSet.add(matches[1]);
        }
        return Array.from(usernamesSet);
    };

    const sendNotifications = async (usernames, message, taggerId, showId) => {
        for (const username of usernames) {
            console.log("username for notification", username)
            try {
                 await axios.post('http://localhost:3333/api/user/createNotification', {
                    message: message,
                    username: username,
                    taggerId: taggerId,
                    showId: showId
                }, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                console.log(`Notification sent to ${username}`);
            } catch (error) {
                console.error(`Error sending notification to ${username}:`, error);
            }
        }
    };

    const handleTextChange = (event) => {
        const text = event.target.value;
        if (text.length > 1000) {
            setErrorMessage('Review cannot exceed 1000 characters');
        } else {
            setErrorMessage('');
            if (text.charAt(text.length - 1) === '@') {
                setIsSearching(true);
            }
            if (!isSearching) {
                setReview(text);
            }
        }
    };

    const markdownTextifier = async () => {
        return new Promise((resolve) => {
            let keys = Object.keys(myMap);
            keys.sort((a, b) => b.length - a.length);

            let updatedReview = review;
            keys.forEach(key => {
                const value = myMap[key];
                const regex = new RegExp(`@${key}`, 'g');
                updatedReview = updatedReview.replace(regex, value);
            });

            resolve(updatedReview);
        });
    };

    const handleSelectedResult = (result) => {
        const texto = `@[${result.name}](http://localhost:3000/${result.type}/${result.id})`;
        setReview(review + `${result.name}`);
        setMyMap(prevMap => ({ ...prevMap, [result.name]: texto }));
        setIsSearching(false);
    };

    return (
        <div ref={ref} className="add-review-container">
            <IconButton className={"close-button"} onClick={onRemove}>
                <CloseIcon />
            </IconButton>
            <form onSubmit={handleSubmit}>
                <div className="rating">
                    {[...Array(5)].map((star, index) => {
                        const ratingValue = 5 - index;
                        return (
                            <label key={index} className={ratingValue <= rating ? "selected" : ""}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={ratingValue}
                                    onClick={() => setRating(ratingValue)}
                                />
                                &#9733; {/* Star character */}
                            </label>
                        );
                    })}
                </div>
                <TextField
                    placeholder={"Write your review..."}
                    className="review-input"
                    multiline={true}
                    onChange={handleTextChange}
                    value={review}
                    maxRows={10}
                    minRows={5}
                />
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <Button variant="contained"
                        type="submit"
                        color="primary"
                        disabled={!(review && rating) || errorMessage !== ''}>
                    Submit Review
                </Button>
            </form>
            <Mention onResultSelect={handleSelectedResult}
                     isSearching={isSearching}
                     setIsSearching={setIsSearching} />
        </div>
    );
});

const ProtectedAddReview = withAuth(AddReview);
export default ProtectedAddReview;