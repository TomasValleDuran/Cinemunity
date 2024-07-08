import React, {useEffect, useState, useRef} from 'react';
import './Show.css';
import {useParams, useNavigate} from "react-router-dom";
import Header from '../shared/header/Header';
import axios from "axios";
import AddReview from "../add-forms/addReview/AddReview";
import withAuth from "../hoc/withAuth";
import Review from "../shared/review/Review";
import {Button, Dialog, DialogContent, DialogTitle, IconButton} from "@mui/material";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import EditIcon from '@mui/icons-material/Edit';
import ModifyImage from "../modify-forms/modify-image/ModifyImage";
import StarIcon from "@mui/icons-material/Star";

const Show = () => {
    const { showId } = useParams();
    const navigate = useNavigate();
    const [directorId, setDirectorId] = useState('');

    const [directorName, setDirectorName] = useState('');

    const [show_type, setShow_type] = useState('');
    const [description, setDescription] = useState('');
    const [celebrities, setCelebrities] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [averageStars, setAverageStars] = useState(0);
    const [seasons, setSeasons] = useState('');
    const [showAddReview, setShowAddReview] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');

    const [showAllCelebrities, setShowAllCelebrities] = useState(false);

    const [reviewsUpdated, setReviewsUpdated] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [imageDialog, setImageDialog] = useState(false);

    const [username, setUsername] = useState('');
    const [admin, setAdmin] = useState(false);

    const addReviewRef = useRef(null);

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
            const reviews = response.data;

            for (let review of reviews) {
                const userResponse = await axios.get(`http://localhost:3333/api/user/get/${review.userId}`, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                review.isVerified = userResponse.data.is_verified;
            }

            console.log(reviews);
            return reviews;
        }
        catch (error) {
            console.error('Error fetching reviews:', error);
            return null;
        }
    }

    const fetchCelebritiesByIds = async (ids) => {
        try {
            const response = await axios.post(`http://localhost:3333/api/celebrity/getCelebritiesByIds`,
                ids, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching celebrities:', error);
            return null;
        }
    }

    const fetchCurrentUserData = async () => {
        try {
            const response = await axios.get('http://localhost:3333/api/user/currentUser', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            if (response.data.wishlist.includes(parseFloat(showId))) {
                setIsInWishlist(true);
            }

            setAdmin(response.data.is_admin);
            setUsername(response.data.username);
        } catch (error) {
            console.error('Error fetching username:', error);
            return null;
        }
    }

    const reloadReviews = async () => {
        setReviewsUpdated(!reviewsUpdated);
    };

    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) {
            setAverageRating(0);
            return;
        }
        const total = reviews.reduce((acc, review) => acc + review.review_rating, 0);
        setAverageRating(total / reviews.length);
        setAverageStars(Math.round(total / reviews.length));
    };

    const handleShowMoreCelebrities = () => {
        setShowAllCelebrities(true);
    }

    const handleCloseMoreCelebrities = () => {
        setShowAllCelebrities(false);
    }

    useEffect(() => {
        fetchCurrentUserData();
        const fetchShowData = async () => {
            const response = await fetchShow();
            response && setDirectorId(response.director);
            response && setShow_type(response.show_type);
            response && setDescription(response.show_desc);
            response && setSeasons(response.seasons);
            response && setTitle(response.title);
            response && setImage(response.image);

            if(response && response.director){
                const directorResponse = await fetchCelebritiesByIds([response.director])
                setDirectorName(directorResponse[0].name);
            }

            if(response && response.actors){
                const celebritiesResponse = await fetchCelebritiesByIds(response.actors)
                setCelebrities(celebritiesResponse)
            }

            if(response && response.actors){
                const celebritiesResponse = await fetchCelebritiesByIds(response.actors)
                setCelebrities(celebritiesResponse)



            }

            if (response && response.reviews) {
                const reviewsResponse = await fetchReviewsByIds(response.reviews);
                setReviews(reviewsResponse);
                calculateAverageRating(reviewsResponse);
            }

        };

        fetchShowData();
    }, [showAddReview, reviewsUpdated]);

    const handleShowAddReview = () => {
        setShowAddReview(true);
    }

    useEffect(() => {
        if (showAddReview && addReviewRef.current) {
            addReviewRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showAddReview]);

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

    const handleCelebrityClick = (celebrityId) => {
        navigate(`/celebrity/${celebrityId}`);
    };

    function errorImage() {
        setImage("https://via.placeholder.com/200");
    }

    // Sort reviews by likes and user
    const currentUserReviews = reviews.filter(review => review.username === username);
    const otherVerifiedReviews = reviews.filter(review => review.username !== username && review.isVerified);
    const otherUnverifiedReviews = reviews.filter(review => review.username !== username && !review.isVerified);

    // Sort each group by likes
    currentUserReviews.sort((a, b) => b.likes - a.likes);
    otherVerifiedReviews.sort((a, b) => b.likes - a.likes);
    otherUnverifiedReviews.sort((a, b) => b.likes - a.likes);

    // Concatenate the groups in the desired order
    const sortedReviews = currentUserReviews.concat(otherVerifiedReviews, otherUnverifiedReviews);

    return (
        <div>
            <Header/>

            <div className={"page-container"}>
                <div className="show-container">
                    <div className={"header"}>
                        <div className="title">
                            <div className="tittle-text">{title}</div>
                        </div>
                    </div>
                    <div className={"show-separator"}>
                        <div className={"show-card"}>
                            <div className={`profile-picture-container-${admin ? 'admin' : ''}`}>
                                <Button onClick={handleImageDialogOpen} size={"large"}>
                                    <img src={image} alt="show" onError={errorImage}/>
                                </Button>
                                {admin && <div className="edit-icon">
                                    <EditIcon/>
                                </div>}
                            </div>
                            <div className={"review-average"}>
                                <h2>Rating: {averageRating.toFixed(1)}</h2>
                                {Array.from({length: averageStars}).map((_, index) => <StarIcon key={index}
                                                                                                className={"start-icon"}/>)}
                            </div>
                        </div>
                        <div className={"show-info"}>
                            <div className={"show-bio"}>
                                <p> {description}</p>
                            </div>
                            <div className={"show-elements"}>
                                <h3> Director: <span className="clickable-name"
                                                     onClick={() => handleCelebrityClick(directorId)}>{directorName}</span>
                                </h3>
                                <h3> Cast:
                                    {celebrities.slice(0, 4).map((celebrity, index) => (
                                        <span key={index} className="clickable-name"
                                              onClick={() => handleCelebrityClick(celebrity.celebrityId)}>
                                                {celebrity.name}{index < celebrities.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                    {celebrities.length > 4 && (<span className="all-actors-button"
                                                                      onClick={handleShowMoreCelebrities}> more </span>)}
                                </h3>
                                <h3>
                                    Type: {show_type}
                                    {seasons.length > 0 && ` Seasons: ${seasons[seasons.length - 1]}`}
                                </h3>
                            </div>

                        </div>
                    </div>
                    <div ref={addReviewRef}>
                    <IconButton onClick={isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
                                    size="large">
                            {isInWishlist ? <BookmarkIcon/> : <BookmarkBorderIcon/>}
                        </IconButton>
                    </div>
                </div>
                <div className={"review-show-container"}>
                    <div className={"header"}>
                        <div className="title">
                            <div className="tittle-text-review">Reviews</div>
                        </div>
                    </div>
                    {showAddReview && <AddReview
                        onRemove={handleShowRemoveReview}
                        showTitle={title}
                        showId={showId}/>}
                    <div>
                        {sortedReviews.map((review) => (
                            <Review
                                key={review.reviewId}
                                id={review.reviewId}
                                username={review.username}
                                userId={review.userId}
                                reviewText={review.review_text}
                                reviewRating={review.review_rating}
                                initialLikes={+review.likes}
                                onRemoveReview={handleShowRemoveReview}
                                title={title}
                                repliesIds={review.replies}
                                onReplyChange={reloadReviews}
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
            <Dialog open={showAllCelebrities} onClose={handleCloseMoreCelebrities}>
                <DialogTitle>All Actors</DialogTitle>
                <DialogContent>
                    {celebrities.map((celebrity, index) => (
                        <p key={index} className="clickable-name" onClick={() => handleCelebrityClick(celebrity.celebrityId)}>
                            {celebrity.name}
                        </p>
                    ))}
                    <Button onClick={handleCloseMoreCelebrities}>Close</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const ProtectedShow = withAuth(Show)
export default ProtectedShow;