import React, {useState} from 'react';
import './AddReview.css';
import axios from "axios";
import withAuth from "../../hoc/withAuth";
import { TextField } from '@mui/material';

const AddReview = ({ showTitle, onRemove }) => {

    const [review, setReview] = useState('');
    const [rating, setRating] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log(rating);
        try {
            const response = await axios.post('http://localhost:3333/api/review/addReview', {
                review: review,
                rating: rating,
                show_title: showTitle
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });

            console.log("res")
            console.log(response.data)
            if (response.status === 200) {
                onRemove();
                window.location.reload(); // malardo esto
            }
        }
        catch (error) {
            console.error('Error al enviar solicitud:', error);
        }
    };

    return (
        <div className="add-review-container">
            <button className="close-button" onClick={onRemove}>X</button>
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

                <TextField placeholder={"Write your review..."} className="review-input"
                multiline={true} onChange={(e) => setReview(e.target.value)}/>
                <button type="submit">Submit Review</button>
            </form>

        </div>
    );
};

const ProtectedAddReview = withAuth(AddReview);
export default ProtectedAddReview;