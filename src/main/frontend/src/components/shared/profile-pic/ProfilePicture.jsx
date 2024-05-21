import React from 'react';
import './ProfilePicture.css';
import NoProfilePicture from "../../assets/no-profile-pic.jpg";

const ProfilePicture = ({ src, alt }) => {
    return (
        <img className="profile-picture" src={src ? src : NoProfilePicture} alt={alt} />
    );
}

export default ProfilePicture;