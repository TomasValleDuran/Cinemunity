import React from 'react';
import UserPreview from "./UserPreview";
import './UserPreviewCarrousel.css';

const UserPreviewCarousel = ({ posts }) => {
    return (
        <div className={'user-preview-carrousel'}>
            {posts.map(post => (
                <UserPreview key={post.userId}
                             id={post.userId}
                             image={post.image}
                             username={post.username}
                             isVerified={post.is_verified}
                             userRating={post.user_rating}/>
            ))}
        </div>
    );
};

export default UserPreviewCarousel;