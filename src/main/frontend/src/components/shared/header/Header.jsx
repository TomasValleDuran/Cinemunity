import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Header.css';
import axios from "axios";
import SearchBar from "./search-bar/SearchBar";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from "../../assets/logo.png";
import {IconButton} from "@mui/material";
import BookmarkIcon from '@mui/icons-material/Bookmark';

const Header = () => {
    const [username, setUsername] = useState('');
    const [userId, setUserid] = useState('');
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    const fetchUsername = async () => {
        try {
            const response = await axios.get('http://localhost:3333//api/user/currentUser', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("cargo el header")
            return response.data;
        } catch (error) {
            console.error('Error fetching username:', error);
            return null;
        }
    }

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:3333/api/user/getNotifications', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log(response.data)
            return response.data;
        }
        catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            const res = await fetchUsername();
            setUsername(res.username);
            setUserid(res.userId);
            const noti = await fetchNotifications();
            setNotifications(noti);
        };

        fetchUserData();
    }, []);

    const handleProfileClick = () => {
        navigate(`/user/${userId}`);
    };

    const handleWishlistClick = () => {
        navigate(`/user/${username}/wishlist`, { state: { userId: userId } });
    }


    return (
        <div className={'header-menu'}>
            <div className={'header-logo'}>
                <Link to={'/home'}>
                    <img src={logo} alt={'logo.png'}/>
                </Link>
            </div>
            <div className={'search-container'}>
                <SearchBar/>
            </div>
            <div className={'header-right-buttons'}>
                <IconButton onClick={handleWishlistClick} size='medium'>
                    <BookmarkIcon fontSize={'large'} className={'btn'}/>
                </IconButton>
                <IconButton onClick={handleProfileClick} size='medium'>
                    <AccountCircleIcon fontSize={'large'} className={'btn'}/>
                </IconButton>
            </div>
        </div>
    );
};

export default Header;