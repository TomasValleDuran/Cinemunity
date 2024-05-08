import React, { useEffect, useState } from 'react';
import './User.css';
import Header from '../shared/header/Header';
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import withAuth from "../hoc/withAuth";
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Menu, MenuItem, IconButton, Button } from '@mui/material';
import ConfirmationDialog from "../shared/confirmation-dialog/ConfirmationDialog";
import ProfilePicture from "../shared/profile-pic/ProfilePicture";

const User = () => {
    const { userId } = useParams()
    const [currentUserId, setCurrentUserId] = useState('');
    const actual = Number(currentUserId) === Number(userId);

    const [username, setUsername] = useState('');
    const [usermail, setUsermail] = useState('');
    const [followers, setFollowers] = useState('');
    const [following, setFollowing] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [rating, setRating] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const navigate = useNavigate();

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3333/api/user/get/${userId}`, {
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
                setProfilePicture(response.data.userImage);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [userId, isFollowing]);

    useEffect(() => {
        const fetchCurrentUserId = async () => {
            try {
                const response = await axios.get('http://localhost:3333/api/user/currentUser', {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                setCurrentUserId(response.data.userId);
                console.log("Current user:", response.data);
                if (response.data.following.includes(Number(userId))) {
                    setIsFollowing(true);
                }
            } catch (error) {
                console.error('Error fetching current user data:', error);
            }
        };
        fetchCurrentUserId();
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

    const handleModifyDialogOpen = () => {
        navigate('/user/modifyUser');
    };

    const handleChangePassword = () => {
        navigate('/user/modifyPassword')
    }

    const handleFollow = async () => {
        try {
            const response = await axios.post('http://localhost:3333/api/user/follow', {
                userId: userId
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("Followed user:", response.data);
            setIsFollowing(true);
            navigate(`/user/${userId}`);
        } catch (error) {
            console.error('Error following user:', error);
        }
    }

    const handleUnfollow = async () => {
        try {
            const response = await axios.post('http://localhost:3333/api/user/unfollow', {
                userId: userId
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("Unfollowed user:", response.data);
            setIsFollowing(false);
            navigate(`/user/${userId}`);
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    }

    return (
        <div>
            <Header />
            <div className={"user-data-container"}>
                <div className={"user-header"}>
                    <div className={"user-image"}>
                        <ProfilePicture src={profilePicture} alt={"profile picture"}/>
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
                    {actual && <div className={"menu-icon"}>
                        <IconButton onClick={handleMenuOpen} size={"large"}>
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem className={"menu-item"} onClick={handleModifyDialogOpen}>Modify Account Information</MenuItem>
                            <MenuItem className={"menu-item"} onClick={handleChangePassword}>Change Password</MenuItem>
                            <MenuItem className={"menu-item"} onClick={handleSignOut}>Log Out</MenuItem>
                            <MenuItem className={"delete-account-item"} onClick={handleDialogOpen}>Delete Account</MenuItem>
                        </Menu>
                    </div> }
                </div>
                <div className={"rating-buttons"}>
                    <div className={"rating"}>
                        <FavoriteIcon />
                        <h2>{String(rating)}</h2>
                    </div>
                    {isAdmin && actual && <div className={"buttons"}>
                        <Button variant="contained" onClick={handleAddShow}>Add Show</Button>
                        <Button variant="contained" onClick={handleAddCelebrity}>Add Celebrity</Button>
                    </div>}
                    {!actual && <div className={"buttons"}>
                        {isFollowing ? (
                            <Button variant="contained" onClick={handleUnfollow}>Unfollow</Button>
                        ) : (
                            <Button variant="contained" onClick={handleFollow}>Follow</Button>
                        )}
                    </div>}
                </div>
            </div>
            <ConfirmationDialog open={dialogOpen} onClose={handleDialogClose} onConfirm={handleDeleteAccount}
                                information={"Account"} isAdmin={isAdmin}/>
        </div>
    );
};

const ProtectedUser = withAuth(User);
export default ProtectedUser;

