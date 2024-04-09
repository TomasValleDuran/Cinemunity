import React, {useState} from 'react';
import './AddReview.css';
import FormInput from "../../shared/form-input/FormInput";

const AddReview = ({ onRemove }) => {

    const [review, setReview] = useState('');
    const [rating, setRating] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const reviewData = {
            review: review,
            rating: rating
        };

        // Aquí puedes hacer una llamada a tu API para enviar la revisión
        // Por ejemplo, usando axios:
        // const response = await axios.post('/api/reviews', reviewData);
    };

    return (
        <div className="add-review-container">
            <button className="close-button" onClick={onRemove}>X</button>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="radio" id="star1" name="rating" value="1" onChange={(e) => setRating(e.target.value)} />
                    <label htmlFor="star1">1</label>
                    <input type="radio" id="star2" name="rating" value="2" onChange={(e) => setRating(e.target.value)} />
                    <label htmlFor="star2">2</label>
                    <input type="radio" id="star3" name="rating" value="3" onChange={(e) => setRating(e.target.value)} />
                    <label htmlFor="star3">3</label>
                    <input type="radio" id="star4" name="rating" value="4" onChange={(e) => setRating(e.target.value)} />
                    <label htmlFor="star4">4</label>
                    <input type="radio" id="star5" name="rating" value="5" onChange={(e) => setRating(e.target.value)} />
                    <label htmlFor="star5">5</label>
                </div>
                <FormInput type="text" value={review} onChange={(e) => setReview(e.target.value)} placeholder="Review"></FormInput>
                <button type="submit">Enviar revisión</button>
            </form>
        </div>
    );
};

export default AddReview;