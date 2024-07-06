import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import axios from "axios";
import SearchBar from "./search-bar/SearchBar";
import logo from "../../assets/logo.png"; // Logo con nombre
import logoSmall from "../../assets/logo-small.png"; // Logo sin nombre
import { IconButton } from "@mui/material";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';


const Header = () => {
    const [username, setUsername] = useState('');
    const [userId, setUserid] = useState('');
    const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 650);
    const navigate = useNavigate();

    const fetchUsername = async () => {
        try {
            const response = await axios.get('http://localhost:3333/api/user/currentUser', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching username:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const res = await fetchUsername();
            setUsername(res.username);
            setUserid(res.userId);
        };

        fetchUserData();

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 650);
            if (window.innerWidth > 650) {
                setIsSearchBarVisible(false); // Reset search bar visibility when resizing to larger screens
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleProfileClick = () => {
        navigate(`/user/${userId}`);
    };

    const handleWishlistClick = () => {
        navigate(`/user/${username}/wishlist`, { state: { userId: userId } });
    };

    const toggleSearchBar = () => {
        setIsSearchBarVisible(!isSearchBarVisible);
    };

    return (
        <header className='header-menu'>
            <div className={`header-logo ${isMobile && isSearchBarVisible ? 'hidden' : ''}`}>
                <Link to='/home'>
                    <img src={logo} alt='logo.png' className='logo-large' />
                    <img src={logoSmall} alt='logo-small.png' className='logo-small' />
                </Link>
            </div>
            <div className={`search-container ${isMobile && isSearchBarVisible ? 'visible' : ''}`}>
                <SearchBar />
            </div>
            <div className={`header-right-buttons ${isMobile && isSearchBarVisible ? 'hidden' : ''}`}>
                {isMobile && (
                    <IconButton onClick={toggleSearchBar} size='medium'>
                        <SearchIcon fontSize='large' className='btn' />
                    </IconButton>
                )}
                {!isMobile || !isSearchBarVisible ? (
                    <>
                        <IconButton onClick={handleWishlistClick} size='medium'>
                            <BookmarkIcon fontSize='large' className='btn' />
                        </IconButton>
                        <IconButton onClick={handleProfileClick} size='medium'>
                            <AccountCircleIcon fontSize='large' className='btn' />
                        </IconButton>
                    </>
                ) : null}
            </div>
            {isMobile && isSearchBarVisible && (
                <div className='search-close-button'>
                    <IconButton onClick={toggleSearchBar} size='medium'>
                        <CloseIcon fontSize='large' className='btn'/>
                    </IconButton>
                </div>
            )}
        </header>
    );
};

export default Header;