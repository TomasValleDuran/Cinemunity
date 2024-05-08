import React, {useEffect, useState} from 'react';
import {Button, IconButton, TextField} from '@mui/material';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import withAuth from "../../hoc/withAuth";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import "./ModifyUser.css"
import {wait} from "@testing-library/user-event/dist/utils";

function ModifyUser() {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [selectedFile, setSelectedFile] = useState(null);
    const [legalFile, setLegalFile] = useState(true);

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
        try {
            const response = await axios.put('http://localhost:3333/api/user/updateUserInfo', {
                username,
                email,
                password
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("Updated user succesfully:", response.data);

            if (selectedFile) {
                // Get the file name
                const fileName = selectedFile.name;

                // Create a JSON object with the folder and objectKey
                const data = {
                    folder: 'Users/',
                    objectKey: fileName
                };

                // Send the JSON object to the backend
                const response = await axios.post('http://localhost:3333/api/upload', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // Get the presigned URL from the response
                const presignedUrl = response.data.url;
                const fullObjectKey = response.data.fullObjectKey;
                console.log(response.data)
                console.log(presignedUrl)
                console.log(fullObjectKey)

                // Upload the file to S3
                await axios.put(presignedUrl, selectedFile);

                console.log('File uploaded successfully');

                console.log("FullObjectKey: ", fullObjectKey)
                console.log("Image URL:", presignedUrl)

                const responseImage = await axios.put('http://localhost:3333/api/user/updateUserImage', {
                    fullObjectKey
                }, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                console.log("Updated user image succesfully:", responseImage.data);
            }

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
        if ((file && file.type.startsWith('image/'))) {
            setSelectedFile(file);
            setLegalFile(true);
        } else {
            console.error('Invalid file type, please select an image file.');
            setSelectedFile(null);
            setLegalFile(false);
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
                <TextField
                    type="username"
                    label="Username"
                    value={username}
                    onChange={handleUsernameChange}
                />
                <TextField
                    type="email"
                    label="Email"
                    value={email}
                    onChange={handleEmailChange}
                />
                <TextField
                    label="Current Password"
                    value={password}
                    onChange={handlePasswordChange}
                    type="password"
                    required={true}
                />
                <input type="file" onChange={handleFileChange}/>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <Button variant="contained" type="submit" color="primary"
                disabled={selectedFile != null && !legalFile}>
                    Confirm
                </Button>
            </form>
        </div>

    );
}

const ProtectedModifyUser = withAuth(ModifyUser)
export default ProtectedModifyUser;