import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Header.css';
import axios from "axios";
import SearchBar from "./search-bar/SearchBar";
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from "../../assets/logo.png";
import {IconButton} from "@mui/material";

const Header = () => {
    const [username, setUsername] = useState(''); // Username of the currently signed-in user
    const [userid, setUserid] = useState(''); // User ID of the currently signed-in user
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

    useEffect(() => {
        const fetchUserData = async () => {
            const res = await fetchUsername();
            setUsername(res.username);
            setUserid(res.userId);
        };

        fetchUserData();
    }, []);

    const handleProfileClick = () => {
        navigate(`/user/${username}`);
    };

    const handleWishlistClick = () => {
        navigate(`/user/${username}/wishlist`, { state: { userId: userid } });
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
                <IconButton onClick={handleWishlistClick} size="large">Wishlist</IconButton>
                <AccountCircleIcon onClick={handleProfileClick} fontSize={'large'} className={'btn'}/>
            </div>
        </div>
    );
};

export default Header;