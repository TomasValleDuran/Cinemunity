import React, {useEffect, useState} from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import {IconButton} from "@mui/material";
import axios from "axios";

const FacebookShareButton = ({ review, title, username }) => {
    const [currentUsername, setCurrentUsername] = useState("");

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/user/currentUser`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            setCurrentUsername(response.data.username);
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    }

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const shareToFacebook = () => {
        const user = currentUsername === username ? "my" : username + "'s";
        const shareUrl = encodeURIComponent(window.location.href);
        const quote = encodeURIComponent(
            `Check out ${user} review about ${title}: "${review}" Check out more reviews in Cinemunity!`);
        const url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${quote}`;
        window.open(url, '_blank');
    };

    return (
        <IconButton onClick={shareToFacebook} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FacebookIcon/>
        </IconButton>
    );
};

export default FacebookShareButton;
