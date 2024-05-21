// External libraries
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, MenuItem, IconButton, Button, DialogContent, DialogTitle, Dialog } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import Header from '../shared/header/Header';
import withAuth from "../hoc/withAuth";
import ConfirmationDialog from "../shared/confirmation-dialog/ConfirmationDialog";
import ProfilePicture from "../shared/profile-pic/ProfilePicture";
import ModifyImage from "../modify-forms/modify-image/ModifyImage";

import './User.css';
import NoProfilePicture from "../assets/no-profile-pic.jpg";

const User = () => {
    const { userId } = useParams()
    const [currentUserId, setCurrentUserId] = useState('');
    const actual = Number(currentUserId) === Number(userId);

    const [username, setUsername] = useState('');
    const [followers, setFollowers] = useState('');
    const [following, setFollowing] = useState('');
    const [currentImage, setCurrentImage] = useState('');
    const [rating, setRating] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isVerify, setIsVerify] = useState(false);

    const [anchorElAdd, setAnchorElAdd] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const navigate = useNavigate();
    const [imageDialog, setImageDialog] = useState(false);


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
            setFollowers(response.data.followers.length);
            setFollowing(response.data.following.length);
            setRating(response.data.user_rating);
            setCurrentImage(response.data.image);
            setIsVerify(response.data.is_verified);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    // Fetch user data
    useEffect(() => {
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
                setIsAdmin(response.data.is_admin);
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

    const handleMenuAddOpen = (event) => {
        setAnchorElAdd(event.currentTarget);
    };

    const handleMenuAddClose = () => {
        setAnchorElAdd(null);
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
        const response = await axios.delete(`http://localhost:3333/api/user/deleteUser/${userId}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
        console.log("Deleted user:", response.data);
        if (actual) {
            localStorage.removeItem('token');
            navigate('/signin');
        } else {
            navigate('/home');
        }
    };

    const handleModifyDialogOpen = () => {
        navigate('/user/modifyUser');
    };

    const handleChangePassword = () => {
        navigate('/user/modifyPassword')
    }

    const handleImageDialogOpen = () => {
        if (actual) {
            setImageDialog(true);
        }
    }

    const handleImageDialogClose = () => {
        setImageDialog(false);
    }

    const handleImageChange = (newImageUrl) => {
        if (newImageUrl !== currentImage) {
            fetchUserData();
        }
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

    const handleVerify = async () => {
        if (!isAdmin) {return;}
        try {
            const response = await axios.put(`http://localhost:3333/api/user/verify/${userId}`,
                {userId: userId},
                {headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
            console.log(response);
            setIsVerify(!isVerify);
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    }

    const handleFollowLink = (type) => {
        navigate(`/user/${type}/${userId}`);
    }

    return (
        <div>
            <Header />
            <div className={"user-container"}>
                {actual &&
                    <div className={"menus"}>
                        {isAdmin &&
                            <div className={"menu-icon"}>
                                <IconButton onClick={handleMenuAddOpen} size={"large"}>
                                    <AddIcon/>
                                </IconButton>
                                <Menu
                                    anchorEl={anchorElAdd}
                                    keepMounted
                                    open={Boolean(anchorElAdd)}
                                    onClose={handleMenuAddClose}
                                >
                                    <MenuItem className={"menu-item"} onClick={handleAddShow}>Add Show</MenuItem>
                                    <MenuItem className={"menu-item"} onClick={handleAddCelebrity}>Add Celebrity</MenuItem>
                                </Menu>
                            </div>
                        }
                        <div className={"menu-icon"}>
                            <IconButton onClick={handleMenuOpen} size={"large"}>
                                <MenuIcon/>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem className={"menu-item"} onClick={handleModifyDialogOpen}>Modify Account
                                    Information</MenuItem>
                                <MenuItem className={"menu-item"} onClick={handleChangePassword}>Change Password</MenuItem>
                                <MenuItem className={"menu-item"} onClick={handleSignOut}>Log Out</MenuItem>
                                <MenuItem className={"delete-account-item"} onClick={handleDialogOpen}>Delete
                                    Account</MenuItem>
                            </Menu>
                        </div>
                    </div>
                }
                {!actual && isAdmin &&
                    <div className={"menus"}>
                        <div className={"menu-icon"}>
                            <IconButton onClick={handleMenuOpen} size={"large"}>
                                <MenuIcon/>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem className={"delete-account-item"} onClick={handleDialogOpen}>Delete
                                    Account</MenuItem>
                            </Menu>
                        </div>
                    </div>
                }
                <div className={"user-header"}>
                    <div className="profile-picture-container">
                        <Button onClick={handleImageDialogOpen}>
                            <ProfilePicture
                                src={currentImage ? currentImage : NoProfilePicture}
                                alt={"profile picture"}
                            />
                        </Button>
                        {actual && <ModeEditIcon className="edit-icon"/>}
                        {(isVerify || isAdmin) && <div className={"verify-container"}>
                            <IconButton onClick={handleVerify}>
                                {isVerify ? <CheckCircleIcon className={"verify-button"}/>
                                    : <CheckCircleOutlineIcon/>}
                            </IconButton>
                        </div>}
                    </div>
                    <div className={"username-rating"}>
                        <h1>{username}</h1>
                        <div className={"rating-user"}>
                            <FavoriteIcon className={"favorite-icon-user"}/>
                            <h2>{String(rating)}</h2>
                        </div>
                    </div>
                    <div className={"followers-following"}>
                        <div className={"followers"}>
                            <h3 className={"follow-link"}
                                onClick={(event) => handleFollowLink("followers")}>
                                Followers</h3>
                            <h4>{followers}</h4>
                        </div>
                        <div className={"following"}>
                            <h3 className={"follow-link"}
                                onClick={(event) =>handleFollowLink("following")}>
                                Following</h3>
                            <h4>{following}</h4>
                        </div>
                    </div>
                </div>
                <div className={"rating-buttons"}>
                    {!actual && <div className={"buttons"}>
                        {isFollowing ? (
                            <Button variant="outlined" onClick={handleUnfollow}>Unfollow</Button>
                        ) : (
                            <Button variant="contained" onClick={handleFollow}>Follow</Button>
                        )}
                    </div>}
                </div>
            </div>
            <ConfirmationDialog open={dialogOpen} onClose={handleDialogClose} onConfirm={handleDeleteAccount}
                                information={"Account"} isAdmin={isAdmin && actual}/>
            <Dialog open={imageDialog} onClose={handleImageDialogClose} className="dialog">
                <DialogTitle className="dialog-title">Modify Profile Picture</DialogTitle>
                <DialogContent className="dialog-content">
                    <ModifyImage
                        type="user"
                        folder="Users/"
                        id={currentUserId}
                        currentImage={currentImage}
                        onImageChange={handleImageChange}/>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const ProtectedUser = withAuth(User);
export default ProtectedUser;

