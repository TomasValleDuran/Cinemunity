import React, {useEffect, useState} from 'react';
import './User.css';
import Header from '../shared/header/Header';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Sample_User_Icon from "../assets/Sample_User_Icon.png";
import heart from "../assets/heart.png";
import menuicon from "../assets/menu-icon.png";
import withAuth from "../hoc/withAuth";

const User = () => {

    const [username, setUsername] = useState('');
    const [usermail, setUsermail] = useState('');
    const [followers, setFollowers] = useState('');
    const [following, setFollowing] = useState('');
    const [rating, setRating] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();


    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:3333/api/user/currentUser', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("información de user:", response.data)
            return response.data;
        } catch (error) {
            console.error('Error fetching username:', error);
            return null;
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await fetchUser();
            console.log(response)
            response && setUsername(response.username);
            response && setUsermail(response.email);
            response && setIsAdmin(response.is_admin);
            response && setFollowers(response.followers.length);
            response && setFollowing(response.following.length);
            response && setRating(response.user_rating);
        };

        fetchUserData();
    }, []);

    const handleMovieClick = () => {
        navigate(`/addMovie`);
    }

    const handleMovieClick2 = () => {
        navigate(`/addCelebrity`);
    }

    return (
        <div>
            <Header />
            <div className={"user-data-container"}>
                <div className={"user-header"}>
                    <div className={"user-image"}>
                        <img src={Sample_User_Icon} alt={"imagen"}/>
                    </div>
                    <div className={"username-mail"}>
                        <h1>{username}</h1>
                        <h4>{usermail}</h4>
                    </div>
                    <div className={"followers"}>
                        <h2>Followers</h2>
                        <h3>{followers}</h3>
                    </div>
                    <div className={"following"}>
                        <h2>Following</h2>
                        <h3>{following}</h3>
                    </div>
                    <div className={"menu-icon"}>
                        <img src={menuicon} alt={"menu icon"}/>
                    </div>
                </div>
                <div className={"rating-buttons"}>
                    <div className={"rating"}>
                        <img src={heart} alt={"heart"}/>
                        <h2>{String(rating)}</h2>
                    </div>
                    <div className={"buttons"}>
                        {isAdmin && <button onClick={handleMovieClick}>Agregar Shows</button>}
                        {isAdmin && <button onClick={handleMovieClick2}>Agregar Celebridades</button>}

                    </div>
                </div>
            </div>
        </div>
    );
};

const ProtectedUser = withAuth(User);
export default ProtectedUser;