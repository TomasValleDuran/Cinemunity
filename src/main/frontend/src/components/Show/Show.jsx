import React, {useEffect, useState} from 'react';
import './Show.css';
import {useParams} from "react-router-dom";
import Header from '../shared/header/Header';
import axios from "axios";
import AddReview from "../addForms/addReview/AddReview";
import withAuth from "../hoc/withAuth";
import Review from "../shared/review/Review";
import {Button, Dialog, DialogContent, DialogTitle, IconButton} from "@mui/material";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import EditIcon from '@mui/icons-material/Edit';
import ModifyImage from "../modify-forms/modify-image/ModifyImage";

const Show = () => {
    const { showId } = useParams();
    const [director, setDirector] = useState('');
    const [show_type, setShow_type] = useState('');
    const [description, setDescription] = useState('');
    const [actors, setActors] = useState([]);
    const [seasons, setSeasons] = useState('');
    const [showAddReview, setShowAddReview] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');

    const [reviewsUpdated, setReviewsUpdated] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [imageDialog, setImageDialog] = useState(false);

    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [admin, setAdmin] = useState(false);


    const fetchShow = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/show/get/${showId}`, {
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
                showId: showId
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("Se agrego: ", response.data.title)
            setIsInWishlist(true);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching show:', error);
            return null;
        }

    }

    const handleRemoveFromWishlist = () => {
        axios.delete(`http://localhost:3333/api/user/wishlist/${showId}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log("se borro: " + response.data.title)
                setIsInWishlist(false);
            })
            .catch(error => {
                console.error('Error deleting review:' + error);
            });
    };

    const fetchCurrentUserData = async () => {
        try {
            const response = await axios.get('http://localhost:3333//api/user/currentUser', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            if (response.data.wishlist.includes(parseFloat(showId))) {
                setIsInWishlist(true);
            }
            setUserId(response.data.userId);
            setAdmin(response.data.is_admin);
            setUsername(response.data.username);
        } catch (error) {
            console.error('Error fetching username:', error);
            return null;
        }
    }


    useEffect(() => {
        fetchCurrentUserData();
        const fetchShowData = async () => {
            const response = await fetchShow();
            response && setDirector(response.director);
            response && setShow_type(response.show_type);
            response && setDescription(response.show_desc);
            response && setActors(response.actors);
            response && setSeasons(response.seasons);
            response && setTitle(response.title);
            response && setImage(response.image);
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

    const handleImageDialogOpen = () => {
        if (admin) {
            setImageDialog(true);
        }
    }

    const handleImageDialogClose = () => {
        setImageDialog(false);
    }

    const handleImageChange = async (newImageUrl) => {
        if (newImageUrl !== image) {
            const response = await fetchShow();
            response && setImage(response.image);
        }
    }

    // Sort reviews by likes and user
    const currentUserReviews = reviews.filter(review => review.username === username);
    const otherReviews = reviews.filter(review => review.username !== username);
    otherReviews.sort((a, b) => b.likes - a.likes);
    const sortedReviews = currentUserReviews.concat(otherReviews);

    return (
        <div>
            <Header/>
            <div className={"page-container"}>
                <div className="container">
                    <div className={"show-separator"}>
                        <div className={"show-card"}>
                            <div className={`profile-picture-container-${admin ? 'admin' : ''}`}>
                                <Button onClick={handleImageDialogOpen} size={"large"}>
                                    <img src={image ? image : "https://via.placeholder.com/200"} alt="show"/>
                                </Button>
                                {admin && <div className="edit-icon">
                                    <EditIcon/>
                                </div>}
                            </div>
                        </div>
                        <div className={"show-info"}>
                            <div className={"header"}>
                                <div className="title">
                                    <div className="tittle-text">{title}</div>
                                </div>
                            </div>
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
                    <div>
                        <IconButton onClick={isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
                                    size="large">
                            {isInWishlist ? <BookmarkIcon/> : <BookmarkBorderIcon/>}
                        </IconButton>
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
                                key={review.reviewId}
                                id={review.reviewId}
                                username={review.username}
                                userId={review.userId}
                                reviewText={review.review_text}
                                reviewRating={review.review_rating}
                                initialLikes={+review.likes}
                                onRemoveReview={handleShowRemoveReview}
                            />))}

                    </div>
                </div>
                <button className="floating-button" onClick={handleShowAddReview}>+</button>
            </div>
            <Dialog open={imageDialog} onClose={handleImageDialogClose} className="dialog">
                <DialogTitle className="dialog-title">Modify Profile Picture</DialogTitle>
                <DialogContent className="dialog-content">
                    <ModifyImage
                        type="show"
                        folder="Shows/"
                        id={showId}
                        currentImage={image}
                        onImageChange={handleImageChange}/>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const ProtectedShow = withAuth(Show)
export default ProtectedShow;