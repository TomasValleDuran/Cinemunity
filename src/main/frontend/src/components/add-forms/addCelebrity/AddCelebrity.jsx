import React, { useEffect, useState } from 'react';
import './AddCelebrity.css';
import axios from "axios";
import withAuth from "../../hoc/withAuth";
import { Backdrop, Button, CircularProgress, IconButton, TextField, InputAdornment } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate } from "react-router-dom";
import FileUploadButton from "../../shared/material-ui-stolen/FileUploadButton";
import CelebrityBox from "../../shared/celebrity-import/CelebrityImportPreview";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const AddCelebrity = () => {
    const [userId, setUserId] = useState('');
    const [celebrityName, setCelebrityName] = useState('');
    const [celebrityBio, setCelebrityBio] = useState('');

    const [searchName, setSearchName] = useState('');
    const [results, setResults] = useState([]);

    const [errorMessage, setErrorMessage] = useState('');

    const [selectedFile, setSelectedFile] = useState(null);
    const [legalFile, setLegalFile] = useState(false);
    const [open, setOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3333/api/user/currentUser`, {
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
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setLegalFile(true);
            setImageUrl(''); // Clear the URL when a new file is selected
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

    const uploadFileToS3 = async (file) => {
        const fileName = file.name;
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
        const fullObjectKey = urlPackage.data.fullObjectKey;

        await axios.put(presignedUrl, file);
        console.log('File uploaded successfully');
        return fullObjectKey;
    };

    const uploadImageUrlToS3 = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], `image-${Date.now()}.jpg`, { type: blob.type });
        return await uploadFileToS3(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let fullObjectKey = '';
        setOpen(true);
        try {
            if (selectedFile) {
                fullObjectKey = await uploadFileToS3(selectedFile);
            } else if (imageUrl) {
                fullObjectKey = await uploadImageUrlToS3(imageUrl);
            }

            const response = await axios.post('http://localhost:3333/api/celebrity/addCelebrity', {
                name: celebrityName,
                biography: celebrityBio,
                objectKey: fullObjectKey
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                }
            });
            console.log(response.data);
            resetValues();
        } catch (error) {
            console.error(error.response.data, error);
            setErrorMessage(error.response.data);
            if (fullObjectKey) {
                axios.delete('http://localhost:3333/api/deleteImage', {
                    data: { fullObjectKey: fullObjectKey },
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then(() => {
                    console.log("Deleted image from s3 successfully");
                }).catch((error) => {
                    console.error('Failed to delete the old image:', error);
                });
            }
            setOpen(false);
        }
    }

    const resetValues = () => {
        setCelebrityName('');
        setCelebrityBio('');
        setErrorMessage('');
        setResults([]);
        setSearchName('');
        setPreviewUrl(null);
        setSelectedFile(null);
        setLegalFile(true);
        setOpen(false);
    }

    const handleSearchChange = (event) => {
        setSearchName(event.target.value);
    }

    const handleImport = async () => {
        console.log(searchName);
        try {
            const response = await axios.get(`http://localhost:3333/api/celebrity/importInfo/${searchName}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("Results: ", response.data);
            setResults(response.data.results);
        }
        catch (error) {
            console.error('Error importing celebrity:', error);
        }
    }

    const handleCelebrityImport = (celebrityData) => {
        setCelebrityName(celebrityData.name);
        setCelebrityBio(celebrityData.biography);
        // usaba http://image.tmdb.org/t/p/w500/ y no funcaba
        setPreviewUrl(`https://image.tmdb.org/t/p/w220_and_h330_face/${celebrityData.profile_path}`);
        setImageUrl(`https://image.tmdb.org/t/p/w220_and_h330_face/${celebrityData.profile_path}`);

        setResults([]);
        setSearchName('');
    };

    const handleNextClick = () => {
        if (currentIndex * 5 < results.length - 5) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevClick = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className={"add-celebrity-container"}>
                <div className={"back"}>
                    <IconButton aria-label="back" onClick={() => navigate(`/user/${userId}`)}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>
                <div className={"header"}>
                    <div className="title">
                        <div className="tittle-text">Add Celebrity</div>
                    </div>
                </div>
                <div className={"celebrity-search-results-form-container"}>
                    <div className={"celebrity-import-search"}>
                        <TextField
                            type={"import"}
                            label={"Search Celebrity"}
                            value={searchName}
                            onChange={handleSearchChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleImport}>
                                            <SearchIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {results.length > 0 && <div className={"show-results-pagination"}>
                            <IconButton onClick={handlePrevClick}>
                                <ArrowBackIosNewIcon/>
                            </IconButton>
                            <IconButton onClick={handleNextClick}>
                                <ArrowForwardIosIcon/>
                            </IconButton>
                        </div>}
                        <div className="celebrity-results">
                            {results.slice(currentIndex * 5, currentIndex * 5 + 5).map((result, index) => {
                                return (
                                    <CelebrityBox
                                        key={index}
                                        id={result.id}
                                        name={result.name}
                                        image={`http://image.tmdb.org/t/p/w500/${result.profile_path}`}
                                        onImport={handleCelebrityImport}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className={"add-celebrity-form"}>
                        <TextField
                            type="name"
                            label="Name"
                            value={celebrityName}
                            required={true}
                            onChange={handleCelebrityChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            className={"bio-text"}
                            type="biography"
                            label="Biography"
                            multiline={true}
                            value={celebrityBio}
                            required={true}
                            onChange={handleBiographyChange}
                            fullWidth
                            margin="normal"
                        />
                        <FileUploadButton onChange={handleFileChange} />
                        {previewUrl && <img className={"preview-image"} src={previewUrl} alt="Preview" />}
                        {!legalFile && <p className={"error-message"}>{errorMessage}</p>}
                        <Button variant="contained" type="submit" color="primary"
                                disabled={!legalFile && !imageUrl}>
                            Save
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const ProtectedAddCelebrity = withAuth(AddCelebrity);
export default ProtectedAddCelebrity;
