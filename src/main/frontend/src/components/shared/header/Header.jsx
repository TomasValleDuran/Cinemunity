import React, {useState, useEffect} from 'react';
import logo from "../../assets/logo.png";
import {Link, useNavigate} from 'react-router-dom';
import './Header.css';
import axios from "axios";

const Header = () => {
    const [searchType, setSearchType] = useState('movie'); // Default search type
    const [username, setUsername] = useState(''); // Username of the currently signed-in user
    const navigate = useNavigate();

    const fetchUsername = async () => {
        try {
            const response = await axios.get('http://localhost:3333/user/currentUser');
            console.log(response.data);
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

    const handleSelect = (event) => {
        setSearchType(event.target.value);
    };

    const handleProfileClick = () => {
        navigate(`/user/${username}`);
    };

    return (
        <div className={'header-menu'}>
            <div className={'header-logo'}>
                <Link to={'/home'}>
                    <img src={logo} alt={'logo.png'}/>
                </Link>
            </div>
            <div className={'search'}>
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
            </div>
            <div className={'header-profile'} onClick={handleProfileClick}>
                <div className={'header-profile-username'}>
                    {username}
                </div>
            </div>
        </div>
    );
};

export default Header;