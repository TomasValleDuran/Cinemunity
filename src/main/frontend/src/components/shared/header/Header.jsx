import React, {useState, useEffect} from 'react';
import logo from "../../assets/logo.png";
import {Link, useNavigate} from 'react-router-dom';
import './Header.css';
import axios from "axios";

const Header = () => {
    const [searchType, setSearchType] = useState('movie'); // Default search type
    const [username, setUsername] = useState(''); // Username of the currently signed-in user
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');

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

    const performSearch = async (endpoint, searchInput, successCriteria, navigatePath) => {
        try {
            const response = await axios.get(`http://localhost:3333/api/${endpoint}/get/${searchInput}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            if (response.data[successCriteria]) {
                console.log(response.data);
                navigate(`/${navigatePath}/${searchInput}`);
            } else {
                console.log(response.data);
            }
        } catch (error) {
            console.error(`ERROR: ${navigatePath} not found:`, error);
        }
    };

    const search = async () => {
        if (searchType === 'celebrity') {
            await performSearch('celebrity', searchInput, 'name', 'celebrity');
        }
        else if (searchType === 'user') {
            await performSearch('user', searchInput, 'username', 'user');
        }
        else if (searchType === 'movie') {
            await performSearch('show', searchInput, 'title', 'show');
        }
        else if (searchType === 'tv show') {
            await performSearch('show', searchInput, 'title', 'show');
        }
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
                    <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search"/>
                </div>
                <div className={'header-search-button'}>
                    <button className={"btn-search"} onClick={search}>Search</button> {/* Add onClick event */}
                </div>
            </div>
            <div className={'header-profile'}>
                <button className={"btn-profile"} onClick={handleProfileClick}>
                    {username}
                </button>
                <button className={"btn-logout"} onClick={handleSignOut}>Sign Out</button>
            </div>
        </div>
    );
};

export default Header;