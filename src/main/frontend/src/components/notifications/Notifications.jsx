import React from 'react';
import Header from "../shared/header/Header";
import {useLocation} from "react-router-dom";
import "./Notifications.css"
import { Link } from "react-router-dom"

const Wishlist = () => {

    const notifications = useLocation().state.notifications;

    return (
        <div>
            <Header/>
            <h1>Notifications</h1>
            <div className="notifications-container">
                {notifications.map((notification) => (
                    <Link to={`/show/${notification.showId}`} key={notification.notificationId}>
                        <div className="notification-item">
                            <p>{notification.message}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Wishlist;