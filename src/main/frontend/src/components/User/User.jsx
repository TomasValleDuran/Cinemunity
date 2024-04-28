import React, { useEffect, useState } from 'react';
import './User.css';
import Header from '../shared/header/Header';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sample_User_Icon from "../assets/Sample_User_Icon.png";
import heart from "../assets/heart.png";
import withAuth from "../hoc/withAuth";
import MenuIcon from '@mui/icons-material/Menu';
import { Menu, MenuItem, IconButton, Button } from '@mui/material';
import ConfirmationDialog from "../shared/confirmation-dialog/ConfirmationDialog";

const User = () => {
    const [username, setUsername] = useState('');
    const [usermail, setUsermail] = useState('');
    const [followers, setFollowers] = useState('');
    const [following, setFollowing] = useState('');
    const [rating, setRating] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false); // State for confirmation dialog
    const navigate = useNavigate();

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3333/api/user/currentUser', {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                console.log("User information:", response.data);
                setUsername(response.data.username);
                setUsermail(response.data.email);
                setIsAdmin(response.data.is_admin);
                setFollowers(response.data.followers.length);
                setFollowing(response.data.following.length);
                setRating(response.data.user_rating);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const handleAddShow = () => {
        navigate('/addShow');
    }

    const handleAddCelebrity = () => {
        navigate('/addCelebrity');
    }

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    };

    // Open confirmation dialog
    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    // Close confirmation dialog
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    // Handle account deletion
    const handleDeleteAccount = async () => {
        const response = await axios.delete('http://localhost:3333/api/user/deleteUser', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
        console.log("Deleted user:", response.data);
        localStorage.removeItem('token');
        navigate('/signin');
    };

    return (
        <div>
            <Header />
            <div className={"user-data-container"}>
                <div className={"user-header"}>
                    <div className={"user-image"}>
                        <img src={Sample_User_Icon} alt={"User"} />
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
                        <IconButton onClick={handleMenuOpen}>
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem className={"menu-item"} onClick={handleMenuClose}>Modify Account Information</MenuItem>
                            <MenuItem className={"menu-item"} onClick={handleSignOut}>Log Out</MenuItem>
                            <MenuItem className={"delete-account-item"} onClick={handleDialogOpen}>Delete Account</MenuItem>
                        </Menu>
                    </div>
                </div>
                <div className={"rating-buttons"}>
                    <div className={"rating"}>
                        <img src={heart} alt={"Heart"} />
                        <h2>{String(rating)}</h2>
                    </div>
                    <div className={"buttons"}>
                        {isAdmin && <Button variant="contained" onClick={handleAddShow}>Add Show</Button>}
                        {isAdmin && <Button variant="contained" onClick={handleAddCelebrity}>Add Celebrity</Button>}
                    </div>
                </div>
            </div>
            <ConfirmationDialog open={dialogOpen} onClose={handleDialogClose} onConfirm={handleDeleteAccount} information={"Account"} />
        </div>
    );
};

const ProtectedUser = withAuth(User);
export default ProtectedUser;
