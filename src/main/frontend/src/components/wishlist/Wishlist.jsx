import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useLocation} from "react-router-dom";
import Header from "../shared/header/Header";
import ShowPreviewCarrousel from "../shared/show-preview/ShowPreviewCarrousel";
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
            <div className={"wishlist-container"}>
                <div className={"header"}>
                    <div className="title">
                        <div className="tittle-text">Wishlist</div>
                    </div>
                </div>
                {wishlist.length === 0 && <div className={"no-wishlist"}>
                    <h3 className={"sad-text"}>Nothing in your wishlist yet... Check out some shows and add them!</h3>
                </div>}
            </div>
            <ShowPreviewCarrousel posts={wishlist}/>
        </div>
    );
}

export default Wishlist;