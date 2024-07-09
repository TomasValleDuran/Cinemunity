import React, {useEffect, useState} from 'react';
import './Celebrity.css';
import {useParams, useNavigate} from "react-router-dom";
import Header from '../shared/header/Header';
import axios from "axios";
import withAuth from "../hoc/withAuth";
import {Button, Dialog, DialogContent, DialogTitle, IconButton} from "@mui/material";
import ModifyImage from "../modify-forms/modify-image/ModifyImage";
import EditIcon from "@mui/icons-material/Edit";
import ShowPreviewCarrousel from "../shared/show-preview/ShowPreviewCarrousel";

const Celebrity = () => {

    const { celebrityId } = useParams();
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [image, setImage] = useState('');

    const [imageDialog, setImageDialog] = useState(false);
    const [admin, setAdmin] = useState(false);

    const [directedActed, setDirectedActed] = useState(true);
    const[directedShows, setDirectedShows] = useState([]);
    const [actedShows, setActedShows] = useState([]);

    const navigate = useNavigate();

    const fetchCelebrity = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/celebrity/get/${celebrityId}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("información de celebrity:", response.data)
            setName(response.data.name);
            setBio(response.data.bio);
            setImage(response.data.image);
        }
        catch (error) {
            console.error('Error fetching celebrity:', error);
            return null;
        }

    }

    const fetchDirectedShows = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/celebrity/directedShows/${celebrityId}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            setDirectedShows(response.data);
        } catch (error) {
            console.error('Error fetching directed shows:', error);
            return null;
        }
    }

    const fetchActedShows = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/celebrity/actedShows/${celebrityId}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            setActedShows(response.data);
        } catch (error) {
            console.error('Error fetching acted shows:', error);
            return null;
        }
    }


    useEffect(() => {
        fetchCurrentUserData();
        fetchCelebrity();
        fetchDirectedShows();
        fetchActedShows();
    }, []);

    const fetchCurrentUserData = async () => {
        try {
            const response = await axios.get('http://localhost:3333//api/user/currentUser', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            setAdmin(response.data.is_admin);
        } catch (error) {
            console.error('Error fetching username:', error);
            return null;
        }
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
            const response = await fetchCelebrity();
            response && setImage(response.image);
        }
    }

    const handleSwitchOn = () => {
        setDirectedActed(true);
    }

    const handleSwitchOff = () => {
        setDirectedActed(false);
    }

    function errorImage() {
        setImage("https://via.placeholder.com/200");
    }

    const handleModify = () => {
        if (admin) {
            navigate(`/celebrity/modify/${celebrityId}`)
        }
    }

    return (
        <div className="home-container">
            <Header/>
            <div className="complete-celebrity-container">
                <div className={"celebrity-container"}>
                    <div className={"celebrity-image"}>
                        <div className={`profile-picture-container-${admin ? 'admin' : ''}`}>
                            <Button onClick={handleImageDialogOpen} size={"large"}>
                                <img src={image} alt="celebrity image" onError={errorImage}/>
                            </Button>
                            {admin && <div className="edit-icon">
                                <EditIcon/>
                            </div>}
                        </div>
                    </div>
                    <div className="celebrity-info">
                        <div className={"header"}>
                            <div className="title">
                                <div className="tittle-text">{name}</div>
                            </div>
                        </div>
                        <p>{bio}</p>
                    </div>
                    {admin &&
                        <IconButton onClick={handleModify}>
                            <EditIcon/>
                        </IconButton>}
                </div>
                <div className="shows-container">
                    <div className={"header-switcher"}>
                        <Button variant={directedActed ? "contained" : "outlined"}
                                onClick={handleSwitchOn}>
                            Directed Shows</Button>
                        <Button variant={directedActed ? "outlined" : "contained"}
                                onClick={handleSwitchOff}>Acted Shows</Button>
                    </div>
                    <div className={"show-boolean-preview"}>
                        {directedActed ? <div className="title">
                            <div className="tittle-text">Directed Shows</div>
                        </div> : <div className="title">
                            <div className="tittle-text">Acted Shows</div>
                        </div>}
                        {directedActed ? <ShowPreviewCarrousel posts={directedShows}/>
                            : <ShowPreviewCarrousel posts={actedShows} slide={false}/>}
                    </div>
                </div>
            </div>

            <Dialog open={imageDialog} onClose={handleImageDialogClose} className="dialog">
                <DialogTitle className="dialog-title">Modify Profile Picture</DialogTitle>
                <DialogContent className="dialog-content">
                    <ModifyImage
                        type="celebrity"
                        folder="Celebrities/"
                        id={celebrityId}
                        currentImage={image}
                        onImageChange={handleImageChange}/>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const ProtectedCelebrity = withAuth(Celebrity);
export default ProtectedCelebrity;