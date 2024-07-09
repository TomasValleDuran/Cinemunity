import axios from "axios";
import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import DoneIcon from '@mui/icons-material/Done';
import {IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import "./Notification.css";
import ConfirmationDialog from "../shared/confirmation-dialog/ConfirmationDialog";
import React from "react";

const Notification = ({ notificationId, message, showId, userId, isRead, onChange }) => {
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [userImage, setUserImage] = useState('');

    const handleClick = async () => {
        await handleRead();
        navigate(`/show/${showId}`);
    }

    const fetchUserImage = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/user/get/${userId}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            setUserImage(response.data.image)
        } catch (error) {
            console.error('Error getting user image:', error);
        }
    }

    useEffect(() => {
        fetchUserImage();
    }, []);

    const handleRead = async () => {
        try {
            await axios.put(`http://localhost:3333/api/user/readNotification/${notificationId}`, {}, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log(`Notification ${notificationId} dismissed`);
            onChange();
        } catch (error) {
            console.error('Error dismissing notification:', error);
        }
    }

    const handleUnread = async () => {
        try {
            await axios.put(`http://localhost:3333/api/user/unreadNotification/${notificationId}`, {}, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log(`Notification ${notificationId} dismissed`);
            onChange();
        } catch (error) {
            console.error('Error dismissing notification:', error);
        }
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3333/api/user/deleteNotification/${notificationId}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log(`Notification ${notificationId} deleted`);
            onChange();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    }

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const notificationClassName = isRead ? "read-notification-item" : "notification-item";
    return (
        <div className={notificationClassName}>
            <div className={"notification-user-image"}>
                <img src={userImage} alt={"user"}/>
            </div>
            <div className={"notification-message"} onClick={handleClick}>
                <p>{message}</p>
            </div>
            <div className={"notification-dismiss"}>
                <IconButton onClick={isRead ? handleUnread: handleRead}>
                    <DoneIcon/>
                </IconButton>
            </div>
            <div className={"notification-delete"}>
                <IconButton onClick={handleDialogOpen}>
                    <DeleteIcon aria-label="delete" className={"delete-icon"}/>
                </IconButton>
            </div>
            <ConfirmationDialog open={dialogOpen} onClose={handleDialogClose} onConfirm={handleDelete}
                                information={"Notification"} isAdmin={false}/>
        </div>
    );
}

export default Notification;