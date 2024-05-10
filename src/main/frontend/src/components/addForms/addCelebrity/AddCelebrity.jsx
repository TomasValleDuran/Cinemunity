import React, {useEffect, useState} from 'react';
import './AddCelebrity.css';
import Header from '../../shared/header/Header';
import {FormInput, SendFormButton} from '../../shared/form-input/FormInput';
import axios from "axios";
import withAuth from "../../hoc/withAuth";
import {Backdrop, Button, CircularProgress, IconButton, TextField} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useNavigate} from "react-router-dom";
import FileUploadButton from "../../shared/material-ui-stolen/FileUploadButton";

const AddCelebrity = () => {
    const [userId, setUserId] = useState('');
    const [celebrityName, setCelebrityName] = useState('');
    const [celebrityBio, setCelebrityBio] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [legalFile, setLegalFile] = useState(false);
    const [open, setOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3333/api/user/currentUser`, {
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    });
                setUserId(response.data.userId);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if ((file && file.type.startsWith('image/'))) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setLegalFile(true);
        } else {
            console.error('Invalid file type, please select an image file.');
            setSelectedFile(null);
            setErrorMessage("Invalid file type, please select an image file.");
            setPreviewUrl(null);
            setLegalFile(false);
        }
    };

    function handleCelebrityChange(event) {
        setCelebrityName(event.target.value);
    }

    function handleBiographyChange(event) {
        setCelebrityBio(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let fullObjectKey = '';
        setOpen(true);
        try {
            const fileName = selectedFile.name;
            const data = {
                folder: 'Celebrities/',
                objectKey: fileName
            };
            const urlPackage = await axios.post('http://localhost:3333/api/upload', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const presignedUrl = urlPackage.data.url;
            fullObjectKey = urlPackage.data.fullObjectKey;

            await axios.put(presignedUrl, selectedFile);
            console.log('File uploaded successfully');

            const response = await axios.post('http://localhost:3333/api/celebrity/addCelebrity',{
                name: celebrityName,
                biography: celebrityBio,
                objectKey: fullObjectKey

            }, {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                }
            });
            console.log(response.data);
            setCelebrityName('');
            setCelebrityBio('');
            setErrorMessage('');
            setPreviewUrl(null);
            setSelectedFile(null);
            setLegalFile(true);
            setOpen(false);
        } catch (error) {
            console.error(error.response.data, error);
            setErrorMessage(error.response.data);
            axios.delete('http://localhost:3333/api/deleteImage', { // Don't await this promise
                data: { fullObjectKey: fullObjectKey },
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(() => {
                console.log("Deleted image from s3 successfully");
            }).catch((error) => {
                console.error('Failed to delete the old image:', error);
            });
            setOpen(false);
        }
    }

    return (
        <div>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={open}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <div className={"container"}>
                <div className={"back"}>
                    <IconButton aria-label="back" onClick={() => navigate(`/user/${userId}`)}>
                        <ArrowBackIcon/>
                    </IconButton>
                </div>
                <div className={"header"}>
                    <div className="title">
                        <div className="tittle-text">Add Celebrity</div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className={"inputs"}>
                    <TextField
                        type="name"
                        label="Name"
                        value={celebrityName}
                        required={true}
                        onChange={handleCelebrityChange}
                    />
                    <TextField
                        className={"bio-text"}
                        type="biography"
                        label="Biography"
                        multiline={true}
                        value={celebrityBio}
                        required={true}
                        onChange={handleBiographyChange}/>
                    <FileUploadButton onChange={handleFileChange}/>
                    {!legalFile && <p className={"error-message"}>{errorMessage}</p>}
                    {previewUrl && <img className={"preview-image"} src={previewUrl} alt="Preview" />}
                    <Button variant="contained" type="submit" color="primary"
                            disabled={!legalFile}>
                        Save
                    </Button>
                </form>
            </div>
        </div>
)
    ;
};

const ProtectedAddCelebrity = withAuth(AddCelebrity);
export default ProtectedAddCelebrity;