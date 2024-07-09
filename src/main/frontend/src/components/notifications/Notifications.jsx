import React, {useEffect, useState} from 'react';
import axios from "axios";
import Header from "../shared/header/Header";
import "./Notifications.css"
import Notification from "./Notification";
import {IconButton} from "@mui/material";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import SadPengu from "../assets/sad-penguin.png"

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [change, setChange] = useState(false);

    const fetchCurrentUserNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:3333/api/user/getNotifications', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log(response.data);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

    const handleReadAll = async () => {
        try {
            await axios.put('http://localhost:3333/api/user/readAllNotifications', {}, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log('All notifications read');
            setChange(prevChange => !prevChange);
        } catch (error) {
            console.error('Error reading all notifications:', error);

        }
    }

    useEffect(() => {
        fetchCurrentUserNotifications();
    }, [change]);

    const toggleChange = () => setChange(prevChange => !prevChange);

    return (
        <div>
            <Header/>
            <div className={"notifications-container"}>
                <div className={"header"}>
                    <div className="title">
                        <div className="tittle-text">Notifications</div>
                    </div>
                </div>
                <div className={"Buttons"}>
                    <IconButton onClick={handleReadAll}>
                        <DoneAllIcon/>
                    </IconButton>
                </div>
                <div className="notifications-items">
                    {notifications.length === 0 && <div className={"no-results"}>
                        <h3 className={"sad-text"}>No notifications yet, go make some friends!</h3>
                        <img src={SadPengu} alt={"sad pengu"} className={"sad-pengu"}/>
                    </div>}
                    {notifications.filter(notification => !notification.isRead).map((notification) => (
                        <Notification
                            key={notification.notificationId}
                            notificationId={notification.notificationId}
                            message={notification.message}
                            showId={notification.showId}
                            userId={notification.userId}
                            isRead={notification.isRead}
                            onChange={toggleChange}
                        />
                    ))}
                    {notifications.filter(notification => notification.isRead).map((notification) => (
                        <Notification
                            key={notification.notificationId}
                            notificationId={notification.notificationId}
                            message={notification.message}
                            showId={notification.showId}
                            userId={notification.userId}
                            isRead={notification.isRead}
                            onChange={toggleChange}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Notifications;