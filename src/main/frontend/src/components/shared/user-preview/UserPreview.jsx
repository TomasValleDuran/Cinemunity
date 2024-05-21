import React from 'react';
import ProfilePicture from "../profile-pic/ProfilePicture";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from "@mui/icons-material/Favorite";
import {useNavigate} from "react-router-dom";
import './UserPreview.css';
import NoProfilePicture from "../../assets/no-profile-pic.jpg";

const UserPreview = ({ id, image, username, isVerified, userRating }) => {
    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate(`/user/${id}`);
    }

    return (
        <div className="user-preview" onClick={handleNavigation}>
            <div className={"user-preview-picture"}>
                <ProfilePicture src={image} alt={"imagen"} />
            </div>
            <div className="user-info">
                <div className={"name-verify"}>
                    <h1>{username}</h1>
                    {isVerified ? <CheckCircleIcon className={"verify-button"}/>
                        : <CheckCircleIcon className={"invisible-button"}/>}

                </div>
                <div className={"rating-user"}>
                <FavoriteIcon className={"favorite-icon-user"}/>
                    <h2>{userRating}</h2>
                </div>
            </div>
        </div>
    );
}

export default UserPreview;