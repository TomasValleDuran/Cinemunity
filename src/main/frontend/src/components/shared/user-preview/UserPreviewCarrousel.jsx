import React from 'react';
import UserPreview from "./UserPreview";
import './UserPreviewCarrousel.css';
import SadPengu from "../../assets/sad-penguin.png";

const UserPreviewCarousel = ({ posts }) => {
    return (
        <div className={'user-preview-carrousel'}>
            {posts.length === 0 && <div className={"no-results"}>
                <h3 className={"sad-text"}>It is empty, go make some friends!</h3>
                <img src={SadPengu} alt={"sad pengu"} className={"sad-pengu"}/>
            </div>}
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