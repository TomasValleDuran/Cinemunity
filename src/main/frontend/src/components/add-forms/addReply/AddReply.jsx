import React, { useState } from 'react';
import { Button, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Mention from "../addReview/Mention";
import axios from "axios";

const AddReply = ({ reviewId, userId, onClose }) => {
    const [replyText, setReplyText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [myMap, setMyMap] = useState({});
    const [errorMessage, setErrorMessage] = useState('');


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
            console.log(updatedReview);
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
                onClose()
                //window.location.reload(); // malardo esto
            }
        }
        catch (error) {
            console.error('Error al enviar solicitud:', error);
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
        <div>
            <IconButton className={"close-button"} onClick={onClose}>
                <CloseIcon/>
            </IconButton>
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
                    Submit Review
                </Button>
            </form>
            <Mention onResultSelect={handleSelectedResult}
                     isSearching={isSearching}
                     setIsSearching={setIsSearching}/>
        </div>
    );
};

export default AddReply;