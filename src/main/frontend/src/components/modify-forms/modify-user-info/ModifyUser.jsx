import React, {useEffect, useState} from 'react';
import {Button, IconButton, TextField} from '@mui/material';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import withAuth from "../../hoc/withAuth";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import "./ModifyUser.css"

function ModifyUser() {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

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
                setUsername(response.data.username);
                setEmail(response.data.email);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [userId]);

    useEffect(() => {
        console.log("Image URL:", imageUrl);
    }, [imageUrl]);


    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    //TODO Terminar la image upload
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (selectedFile) {
            // Get the file name
            const fileName = selectedFile.name;

            // Create a JSON object with the folder and objectKey
            const data = {
                folder: 'Users/',
                objectKey: fileName
            };

            try {
                // Send the JSON object to the backend
                const response = await axios.post('http://localhost:3333/api/upload', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // Get the presigned URL from the response
                const presignedUrl = response.data.url;
                const objectKey = response.data.fullObjectKey;

                // Upload the file to S3
                const uploadResponse = await axios.put(presignedUrl, selectedFile);
                console.log('File uploaded successfully:', uploadResponse.data);

                const imageUrl = `https://cinemunitybucket.s3.amazonaws.com/${objectKey}`;
                setImageUrl(imageUrl);
                console.log("Image URL:", imageUrl);

            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }

        try {
            const response = await axios.put('http://localhost:3333/api/user/updateUserInfo', {
                username,
                email,
                password,
                imageUrl
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("Image:", imageUrl);
            console.log("Updated user succesfully:", response.data);

            navigate(`/user/${userId}`)
        } catch (error) {
            if (error.response && error.response.data) {
                console.error(error.response.data, error);
                setErrorMessage(error.response.data);
            } else {
                console.error("Ocurrió un error, pero no se pudo obtener más información", error);
            }
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
        } else {
            console.error('Invalid file type, please select an image file.');
            setSelectedFile(null); // Reset selected file
        }
    };

    return (
        <div className={"container"}>
            <div className={"back"}>
                <IconButton aria-label="back" onClick={() => navigate(`/user/${userId}`)}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
            <div className={"header"}>
                <div className="title">
                    <div className="tittle-text">Modify Account Information</div>
                </div>
            </div>
            <form onSubmit={handleSubmit} className={"inputs"}>
                <div className={"inputs-data"}>
                    <div className={"inputs-texts"}>
                        <TextField
                            type="username"
                            label="Username"
                            value={username}
                            onChange={handleUsernameChange}
                            required={true}
                        />
                        <TextField
                            type="email"
                            label="Email"
                            value={email}
                            onChange={handleEmailChange}
                            required={true}
                        />
                        <TextField
                            label="Current Password"
                            value={password}
                            onChange={handlePasswordChange}
                            type="password"
                            required={true}
                        />
                    </div>
                    <div className={"input-image"}>
                        <input
                            type="file"
                            id="fileInput"
                            style={{display: 'none'}}
                            onChange={handleFileChange}
                        />

                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon/>}
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            Upload profile picture
                        </Button>
                    </div>
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <Button variant="contained" type="submit" color="primary">
                    Confirm
                </Button>
            </form>
        </div>

    );
}

const ProtectedModifyUser = withAuth(ModifyUser)
export default ProtectedModifyUser;