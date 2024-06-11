import React, { useState, useEffect } from 'react';
import './AddReview.css';
import axios from "axios";
import withAuth from "../../hoc/withAuth";
import { Button, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Mention from "./Mention";
import ReactMarkdown from "react-markdown";

const AddReview = React.forwardRef(({ showTitle, onRemove }, ref) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [myMap, setMyMap] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

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
                onRemove();
                //window.location.reload(); // malardo esto
            }
        }
        catch (error) {
            console.error('Error al enviar solicitud:', error);
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