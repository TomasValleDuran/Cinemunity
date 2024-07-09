import React from 'react';
import ReviewPreview from "./ReviewPreview";
import './ReviewPreviewCarrousel.css';

const ReviewPreviewCarrousel = ({ reviews }) => {
    return (
        <div className={'review-preview-carrousel'}>
            {reviews.map(review => (
                <ReviewPreview key={review.reviewId}
                        id={review.reviewId}
                        username={review.username}
                        userId={review.userId}
                        reviewText={review.review_text}
                        reviewRating={review.review_rating}
                        initialLikes={+review.likes}
                        showId={review.showId}
                        image={review.show_img}
                />
            ))}
        </div>
    );
};

export default ReviewPreviewCarrousel