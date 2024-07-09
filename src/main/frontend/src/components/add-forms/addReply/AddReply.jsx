import React, {useEffect, useState} from 'react';
import { Button, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Mention from "../addReview/Mention";
import axios from "axios";
import "./AddReply.css"

const AddReply = ({ reviewId, userId, onClose, onReplyAdded }) => {
    const [replyText, setReplyText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [myMap, setMyMap] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const [currentId, setCurrentId] = useState('');
    const [currentUsername, setCurrentUsername] = useState('');
    const [showId, setShowId] = useState('');
    const [showTitle, setShowTitle] = useState('');

    useEffect(() => {
        const fetchDataForNotification = async () => {
            try {
                const response = await axios.get(`http://localhost:3333/api/review/get/${reviewId}`, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                setCurrentId(response.data.userId);
                setCurrentUsername(response.data.username);
                setShowId(response.data.showId);
                setShowTitle(response.data.title);
            } catch (error) {
                console.error('Error getting review:', error);
            }
        };

        fetchDataForNotification();
    }, [reviewId]);

    const handleTextChange = (event) => {
        const text = event.target.value;
        if (text.length > 1000) {
            setErrorMessage('Reply cannot exceed 1000 characters');
        } else {
            setErrorMessage('');
            if (text.charAt(text.length - 1) === '@') {
                setIsSearching(true);
            }
            if (!isSearching) {
                setReplyText(text);
            }
        }
    };

    const markdownTextifier = async () => {
        return new Promise((resolve) => {
            let keys = Object.keys(myMap);
            keys.sort((a, b) => b.length - a.length);

            let updatedReview = replyText;
            keys.forEach(key => {
                const value = myMap[key];
                const regex = new RegExp(`@${key}`, 'g');
                updatedReview = updatedReview.replace(regex, value);
            });

            resolve(updatedReview);
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const username = await getUsernameFromId(userId);
        const userLink = `@[${username}](http://localhost:3000/user/${userId}) `;
        try {
            let updatedReview = await markdownTextifier();
            updatedReview = userLink + updatedReview;
            const response = await axios.post('http://localhost:3333/api/review/addReply', {
                reply: updatedReview,
                review_id: reviewId
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });

            console.log("res");
            console.log(response.data);
            if (response.status === 200) {
                const usernames = extractUsernames(updatedReview);
                console.log("usernames", usernames);
                console.log("final reply text", updatedReview);
                const message = `${currentUsername} mentioned you in a reply of a review in ${showTitle}!`;
                await sendNotifications(usernames, message, currentId, showId);
                onClose();
                onReplyAdded();
            }
        }
        catch (error) {
            console.error('Error al enviar solicitud:', error);
        }
    };

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
                    showId: showId,
                    reviewId: reviewId
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

    const handleSelectedResult = (result) => {
        const texto = `@[${result.name}](http://localhost:3000/${result.type}/${result.id})`;
        setReplyText(replyText + `${result.name}`);
        setMyMap(prevMap => ({ ...prevMap, [result.name]: texto }));
        setIsSearching(false);
    };

    const getUsernameFromId = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3333/api/user/get/${id}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            return response.data.username;
        }
        catch (error) {
            console.error('Error getting user:', error);
        }
    }

    return (
        <div className={"add-reply-conatiner"}>
            <div className={"close-button-container"}>
                <IconButton className={"close-button"} onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            </div>
            <form onSubmit={handleSubmit}>
                <TextField
                    placeholder={"Write your reply..."}
                    className="reply-input"
                    multiline={true}
                    onChange={handleTextChange}
                    value={replyText}
                    maxRows={10}
                    minRows={5}
                />
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <Button variant="contained"
                        type="submit"
                        color="primary"
                        disabled={!replyText || errorMessage !== ''}>
                    Submit Reply
                </Button>
            </form>
            <Mention onResultSelect={handleSelectedResult}
                     isSearching={isSearching}
                     setIsSearching={setIsSearching}/>
        </div>
    );
};

export default AddReply;