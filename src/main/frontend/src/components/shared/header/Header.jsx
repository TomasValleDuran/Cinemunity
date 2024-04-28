import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Header.css';
import axios from "axios";
import SearchBar from "./search-bar/SearchBar";
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from "../../assets/logo.png";

const Header = () => {
    const [username, setUsername] = useState(''); // Username of the currently signed-in user
    const navigate = useNavigate();

    const fetchUsername = async () => {
        try {
            const response = await axios.get('http://localhost:3333//api/user/currentUser', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("cargo el header")
            return response.data.username;
        } catch (error) {
            console.error('Error fetching username:', error);
            return null;
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            const username = await fetchUsername();
            setUsername(username);
        };

        fetchUserData();
    }, []);

    const handleProfileClick = () => {
        navigate(`/user/${username}`);
    };

    const handleHomeClick = () => {
        navigate('/home');
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
                <HomeIcon onClick={handleHomeClick} fontSize={'large'} className={'btn-home'}/>
                <AccountCircleIcon onClick={handleProfileClick} fontSize={'large'} className={'btn-profile'}/>
            </div>
        </div>
    );
};

export default Header;