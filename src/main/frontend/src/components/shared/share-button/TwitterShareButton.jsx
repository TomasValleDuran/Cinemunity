import React from 'react';
import XIcon from '@mui/icons-material/X';
import {IconButton} from "@mui/material";
import axios from "axios";
import {useEffect, useState} from "react";

const TwitterShareButton = ({ review, title, username }) => {
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

    const shareToTwitter = () => {
        const user = currentUsername === username ? "my" : username + "'s";
        const tweetText = encodeURIComponent(
            `Check out ${user} review about ${title}: \n"${review}" 
            \nCheck out more reviews in Cinemunity!`);
        const url = `https://x.com/intent/tweet?text=${tweetText}`;
        window.open(url, '_blank');
    };

    return (
        <IconButton onClick={shareToTwitter} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <XIcon/>
        </IconButton>
    );
};

export default TwitterShareButton;
