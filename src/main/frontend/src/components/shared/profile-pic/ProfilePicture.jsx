import React from 'react';
import './ProfilePicture.css';

const ProfilePicture = ({ src, alt }) => {
    return (
        <img className="profile-picture" src={src} alt={alt} />
    );
}

export default ProfilePicture;