import React, {useEffect, useState} from 'react';
import './Celebrity.css';
import {useParams} from "react-router-dom";
import Header from '../shared/header/Header';
import axios from "axios";
import withAuth from "../hoc/withAuth";
import {Button, Dialog, DialogContent, DialogTitle} from "@mui/material";
import ModifyImage from "../modify-forms/modify-image/ModifyImage";
import EditIcon from "@mui/icons-material/Edit";
import {wait} from "@testing-library/user-event/dist/utils";

const Celebrity = () => {

    const { celebrityId } = useParams();
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [image, setImage] = useState('');

    const [imageDialog, setImageDialog] = useState(false);
    const [admin, setAdmin] = useState(false);

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

    useEffect(() => {
        fetchCurrentUserData().then(console.log("is admin?", admin))
        fetchCelebrity();
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

    return (
        <div className="home-container">
            <Header />
            <div className="container">
                <div className={"celebrity-container"}>
                    <div className={"celebrity-image"}>
                        <div className={`profile-picture-container-${admin ? 'admin' : ''}`}>
                            <Button onClick={handleImageDialogOpen} size={"large"}>
                                <img src={image ? image : "https://via.placeholder.com/200"} alt="celebrity image"/>
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