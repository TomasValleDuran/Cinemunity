import React, {useState} from 'react';
import './AddReview.css';
import {FormInput} from "../../shared/form-input/FormInput";
import axios from "axios";
import withAuth from "../../hoc/withAuth";

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
                            <label key={index}>
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

                <FormInput type="text" value={review} onChange={(e) => setReview(e.target.value)}
                           placeholder="Review"></FormInput>
                <button type="submit">Enviar revisión</button>
            </form>

        </div>
    );
};

const ProtectedAddReview = withAuth(AddReview);
export default ProtectedAddReview;