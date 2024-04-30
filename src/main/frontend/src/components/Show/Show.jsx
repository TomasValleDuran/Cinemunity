import React, {useEffect, useState} from 'react';
import './Show.css';
import {useParams} from "react-router-dom";
import Header from '../shared/header/Header';
import axios from "axios";
import AddReview from "../addForms/addReview/AddReview";
import withAuth from "../hoc/withAuth";
import Review from "../shared/review/Review";
import {IconButton} from "@mui/material";

const Show = () => {
    const { title } = useParams();
    const [director, setDirector] = useState('');
    const [show_type, setShow_type] = useState('');
    const [description, setDescription] = useState('');
    const [actors, setActors] = useState([]);
    const [seasons, setSeasons] = useState('');
    const [showAddReview, setShowAddReview] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [id, setId] = useState('');
    const [reviewsUpdated, setReviewsUpdated] = useState(false);

    const fetchShow = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/show/get/${title}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("información de show:", response.data)
            return response.data;
        }
        catch (error) {
            console.error('Error fetching show:', error);
            return null;
        }
    }

    const fetchReviewsByIds = async (ids) => {
        try {
            const response = await axios.post(`http://localhost:3333/api/review/getReviewsByIds`,
                ids, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("reviews:", response.data)
            return response.data;
        }
        catch (error) {
            console.error('Error fetching reviews:', error);
            return null;
        }
    }

    const handleAddToWishlist = async () => {
        try {
            const response = await axios.post(`http://localhost:3333/api/user/wishlist`, {
                showId: id
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("información de show:", response.data)
            return response.data;
        }
        catch (error) {
            console.error('Error fetching show:', error);
            return null;
        }

    }


    const handleRemoveFromWishlist = async () => {
        try {
            const response = await axios.delete(`http://localhost:3333/api/user/wishlist/${id}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("borrado")
            return response.data;
        }
        catch (error) {
            console.error("no se pudo borrar");
            return null;
        }
    }

    useEffect(() => {
        console.log("use effect 1")
        const fetchShowData = async () => {
            const response = await fetchShow();
            response && setDirector(response.director);
            response && setShow_type(response.show_type);
            response && setDescription(response.show_desc);
            response && setActors(response.actors);
            response && setSeasons(response.seasons);
            response && setId(response.showId);
            if (response && response.reviews) {
                const reviewsResponse = await fetchReviewsByIds(response.reviews);
                setReviews(reviewsResponse);
            }
        };

        fetchShowData();
    }, [showAddReview, reviewsUpdated]);

    const handleShowAddReview = () => {
        setShowAddReview(true);
    }

    const handleShowRemoveReview = async () => {
        setShowAddReview(false);
        setReviewsUpdated(!reviewsUpdated);
    }

    // Sort reviews by likes and user
    const currentUser = localStorage.getItem('username');
    const currentUserReviews = reviews.filter(review => review.username === currentUser);
    const otherReviews = reviews.filter(review => review.username !== currentUser);
    otherReviews.sort((a, b) => b.likes - a.likes);
    const sortedReviews = currentUserReviews.concat(otherReviews);

    return (
        <div>
            <Header/>
            <div className={"page-container"}>
                <div className="show-container">
                    <div className={"show-title"}>
                        <h1> {title} </h1>
                    </div>
                    <div>
                        <IconButton onClick={handleAddToWishlist} size="large">Add to Wishlist</IconButton>
                        <IconButton onClick={handleRemoveFromWishlist} size="large">Remove from Wishlist</IconButton>
                    </div>
                    <div className={"show-separator"}>
                        <div className={"show-card"}>
                            <img src="https://via.placeholder.com/200" alt="show"/>
                        </div>
                        <div className={"show-info"}>
                            <div className={"show-bio"}>
                                <p> {description}</p>
                            </div>
                            <div className={"show-elements"}>
                                <h3> Director: {director}</h3>
                                <h3> Cast: {actors.join(", ")}</h3>
                                <h3> Show Type: {show_type}</h3>
                                {seasons.length > 0 && <h3> seasons: {seasons[seasons.length - 1]}</h3>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"review-show-container"}>
                    <h2>Reviews</h2>
                    {showAddReview && <AddReview
                        onRemove={handleShowRemoveReview}
                        showTitle={title}/>}
                    <div>
                        {sortedReviews.map((review, index) => (
                            <Review
                                id={review.reviewId}
                                username={review.username}
                                reviewText={review.review_text}
                                reviewRating={review.review_rating}
                                initialLikes={+review.likes}
                                onRemoveReview={handleShowRemoveReview}
                            />))}

                    </div>
                </div>
                <button className="floating-button" onClick={handleShowAddReview}>+</button>
            </div>
        </div>
    );
};

const ProtectedShow = withAuth(Show)
export default ProtectedShow;