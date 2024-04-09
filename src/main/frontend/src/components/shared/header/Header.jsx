import React, {useState, useEffect} from 'react';
import logo from "../../assets/logo.png";
import {Link, useNavigate} from 'react-router-dom';
import './Header.css';
import axios from "axios";

const Header = () => {
    const [searchType, setSearchType] = useState('movie'); // Default search type
    const [username, setUsername] = useState(''); // Username of the currently signed-in user
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const fetchUsername = async () => {
        try {
            const response = await axios.get('http://localhost:3333/user/currentUser', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("respuesta de current user:", response.data)
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

    // Create a function to handle sign out
    const handleSignOut = () => {
        // Remove the token from local storage
        localStorage.removeItem('token');
        console.log("Sesión cerrada")

        // Navigate to the sign-in page
        navigate('/signin');
    };

    const searchShow = async () => {
        if (searchType === 'celebrity') {
            try {
                const response = await axios.get(`http://localhost:3333/celebrity/${search}`, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                if (response.data.name) {
                    console.log(response.data)
                    navigate(`/celebrity/${search}`)
                } else console.log(response.data)
            } catch (error) {
                console.error('ERROR: Celebrity not found:', error);
            }
        } else {
            try {
                const response = await axios.get(`http://localhost:3333/show/${search}`, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                if (response.data.title) {
                    console.log(response.data)
                    navigate(`/show/${search}`)
                } else console.log(response.data)
            } catch (error) {
                console.error('ERROR: Show not found:', error);
            }
        }
    }

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
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search"/>
                </div>
                <div className={'header-search-button'}>
                    <button onClick={searchShow}>Search</button> {/* Add onClick event */}
                </div>
            </div>
            <div className={'header-profile'}>
                <div className={'header-profile-username'} onClick={handleProfileClick}>
                    {username}
                </div>
                <button className={'header-signout'} onClick={handleSignOut}>Sign Out</button>
            </div>
        </div>
    );
};

export default Header;