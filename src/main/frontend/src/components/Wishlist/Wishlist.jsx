import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link, useLocation} from "react-router-dom";
import Header from "../shared/header/Header";
const Wishlist = () => {

    const [wishlist, setWishlist] = useState([]);
    const location = useLocation();
    const userId = location.state.userId;

    const fetchWishlist = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/user/wishlist/${userId}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("información de wishlist:", response.data)
            return response.data;
        }
        catch (error) {
            console.error('Error fetching wishlist:', error);
            return null;
        }
    }

    useEffect(() => {
        const fetchWishlistData = async () => {
            const response = await fetchWishlist();
            setWishlist(response);
        };

        fetchWishlistData();
    }, []);

    return (
        <div>
            <Header />
            <h1>Wishlist</h1>
            <ul>
                {wishlist.map(show => (
                    <li key={show.title}>
                        <Link to={`/show/${show.showId}`} style={{ display: 'block', height: '100%' }}>
                            {show.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Wishlist;