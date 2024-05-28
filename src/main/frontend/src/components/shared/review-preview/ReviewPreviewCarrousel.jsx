import React from 'react';
import Review from "../review/Review";

const ReviewPreviewCarrousel = ({ reviews }) => {
    return (
        <div className={'preview-carrousel'}>
            {reviews.map(review => (
                <Review key={review.reviewId}
                        id={review.reviewId}
                        username={review.username}
                        userId={review.userId}
                        reviewText={review.review_text}
                        reviewRating={review.review_rating}
                        initialLikes={+review.likes}
                />
            ))}
        </div>
    );
};

export default ReviewPreviewCarrousel