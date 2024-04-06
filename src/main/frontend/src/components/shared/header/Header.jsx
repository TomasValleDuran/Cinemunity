import React, {useState, useEffect} from 'react';
import logo from "../../assets/logo.png";
import {useNavigate} from 'react-router-dom';
import axios from "axios";

const Header = () => {
    const [searchType, setSearchType] = useState('movie'); // Default search type
    const [username, setUsername] = useState(''); // Username of the currently signed-in user
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/user/currentUser')
            .then(response => response.json())
            .then(data => setUsername(data.username))
            .catch(error => console.error('Error fetching current user:', error));
    }, []);

    const handleSelect = (event) => {
        setSearchType(event.target.value);
    };

    const handleProfileClick = () => {
        navigate(`/user/${username}`);
    };

    return (
        <div className={'header-menu'}>
            <div className={'header-logo'}>
                <img src={logo} alt={'logo.png'}/>
            </div>
            <div className={'header-search-option'}>
                <select value={searchType} onChange={handleSelect}>
                    <option value="movie">Movie</option>
                    <option value="tv show">TV Show</option>
                    <option value="celebrity">Celebrity</option>
                    <option value="user">User</option>
                </select>
            </div>
            <div className={'header-search'}>
                <input type="text" placeholder="Search"/>
            </div>
            <div className={'header-search-button'}>
                <button>Search</button> {/* Add onClick event */}
            </div>
            <div className={'header-profile'} onClick={handleProfileClick}>
                {username}
            </div>
        </div>
    );
};

export default Header;