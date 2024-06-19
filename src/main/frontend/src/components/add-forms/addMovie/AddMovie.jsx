import React, {useEffect, useState} from 'react';
import axios from "axios";
import './AddMovie.css';
import withAuth from "../../hoc/withAuth";
import {useNavigate} from "react-router-dom";
import FileUploadButton from '../../shared/material-ui-stolen/FileUploadButton';
import {Backdrop, Button, CircularProgress, IconButton, InputAdornment, TextField} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import ShowBox from "../../shared/show-import/ShowImportPreview";
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const AddMovie = () => {
    const [userId, setUserId] = useState('');

    const [Title, setTitle] = useState('');
    const [Description, setDescription] = useState('');
    const [Director, setDirector] = useState('');
    const [showType, setShowType] = useState('Movie');
    const [Actor, setActor] = useState('');
    const [ActorList, setActorList] = useState([]);
    const [Seasons, setSeasons] = useState('');

    const [errorMessage, setErrorMessage] = useState("");

    const [selectedFile, setSelectedFile] = useState(null);
    const [legalFile, setLegalFile] = useState(false);
    const [open, setOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [searchName, setSearchName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [results, setResults] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

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
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setLegalFile(true);
            setImageUrl('');
        } else {
            console.error('Invalid file type, please select an image file.');
            setSelectedFile(null);
            setErrorMessage("Invalid file type, please select an image file.");
            setPreviewUrl(null);
            setLegalFile(false);
        }
    };

    const uploadFileToS3 = async (file) => {
        const fileName = file.name;
        const data = {
            folder: 'Shows/',
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

    const resetValues = () => {
        setTitle('');
        setDescription('');
        setDirector('');
        setActorList([]);
        setSeasons('');
        setPreviewUrl(null);
        setErrorMessage('');
        setImageUrl('');
    }

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

            const response = await axios.post('http://localhost:3333/api/show/addShow', {
                title: Title,
                description: Description,
                director: Director,
                show_type: showType,
                actors: ActorList,
                seasons: Seasons,
                objectKey: fullObjectKey
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });

            if (!response) {
                throw new Error('No response from the server');
            }

            console.log(response.data)
            resetValues();
        } catch (error) {
            console.error(error.response.data, error);
            setErrorMessage(error.response.data);
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
    };

    const handleSelect = (event) => {
        setShowType(event.target.value);
    };

    const handleAddActor = async () => {
        if (Actor === '') {
            return;
        }
        setActorList([...ActorList, Actor]);
        setActor('');
    };

    const handleRemoveActor = (indexToRemove) => {
        setActorList(ActorList.filter((_, index) => index !== indexToRemove));
    };

    function handleTitleChange(event) {
        setTitle(event.target.value);
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    function handleDirectorChange(event) {
        setDirector(event.target.value);
    }

    function handleActorChange(event) {
        setActor(event.target.value);
    }

    function handleSeasonChange(event) {
        const newValue = parseInt(event.target.value, 10);
        if (newValue < 1) {
            setSeasons(1);
        } else {
            setSeasons(newValue);
        }
    }

    const handleSearchChange = (event) => {
        setSearchName(event.target.value);
    }

    const handleImport = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3333/api/${showType.toLowerCase()}/importInfo/${searchName}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("Results: ", response.data);
            setResults(response.data.results);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }

    useEffect(() => {
        if (searchName !== '') {
            setResults([]);
            handleImport();
        }
    }, [showType]);

    const handleCelebrityImport = (showData) => {
        setTitle(showData.title);
        setDescription(showData.overview);

        setActorList(showData.credits.cast.map((actor) => actor.name));
        setPreviewUrl(`https://image.tmdb.org/t/p/w220_and_h330_face/${showData.poster_path}`);
        setImageUrl(`https://image.tmdb.org/t/p/w220_and_h330_face/${showData.poster_path}`);

        if (showType === 'TVShow') {
            setSeasons(showData.number_of_seasons);
            setTitle(showData.name);
            setDirector(showData.created_by[0].name);
        }
        if (showType === 'Movie') {
            setDirector(showData.credits.crew[0].name);
        }

        setResults([]);
        setSearchName('');
    }

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
            <div className="add-show-container">
                <div className={"back"}>
                    <IconButton aria-label="back" onClick={() => navigate(`/user/${userId}`)}>
                        <ArrowBackIcon/>
                    </IconButton>
                </div>
                <div className={"header"}>
                    <div className="title">
                        <div className="tittle-text">Add Show</div>
                    </div>
                </div>
                <div className="show-type-selector">
                    <select value={showType} onChange={handleSelect} className="form-control">
                        <option value="Movie">Movie</option>
                        <option value="TVShow">TV Show</option>
                    </select>
                </div>
                <div className={"show-search-results-form-container"}>
                    <div className={"show-import-search"}>
                        <TextField
                            type={"import"}
                            label={"Search Show"}
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
                        <div className="show-results">
                            {results.slice(currentIndex * 5, currentIndex * 5 + 5).map((result, index) => {
                                const showName = showType === 'Movie' ? result.title : result.name;
                                return (
                                    <ShowBox
                                        key={index}
                                        id={result.id}
                                        name={showName}
                                        image={`http://image.tmdb.org/t/p/w500/${result.poster_path}`}
                                        type={showType}
                                        onImport={handleCelebrityImport}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className={"add-show-form"}>
                        {showType === 'TVShow' && (
                            <TextField
                                type={"number"}
                                label={"Seasons"}
                                value={Seasons}
                                required={true}
                                onChange={handleSeasonChange}
                                fullWidth
                                margin="normal"
                            />
                        )}
                        <TextField
                            type="title"
                            label="Title"
                            value={Title}
                            required={true}
                            onChange={handleTitleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            type="description"
                            label="Description"
                            multiline={true}
                            value={Description}
                            required={true}
                            onChange={handleDescriptionChange}
                            fullWidth
                            margin="normal"
                            maxRows={10}
                            minRows={5}
                        />
                        <TextField
                            type="director"
                            label="Director"
                            value={Director}
                            required={true}
                            onChange={handleDirectorChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            type="actor"
                            label="Actor"
                            value={Actor}
                            variant="outlined"
                            onChange={handleActorChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleAddActor} edge="end">
                                            <AddIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                            margin="normal"
                        />
                        <div className="actor-list-container">
                            <h3>Added Actors:</h3>
                            <ul className="actor-list">
                                {ActorList.map((actor, index) => (
                                    <li key={index}>
                                        {actor}
                                        <span className="delete-actor"
                                              onClick={() => handleRemoveActor(index)}>&times;</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="image-upload-container">
                            <FileUploadButton onChange={handleFileChange}/>
                            {previewUrl &&
                                <img className={"add-show-preview-image"} src={previewUrl} alt="Preview"/>}
                        </div>
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        <Button variant="contained" type="submit" color="primary"
                                disabled={!((legalFile || imageUrl) && Title && Description && Director && ActorList.length > 0)}>
                            Add {showType}
                        </Button>
                    </form>
                </div>

            </div>
        </div>
    );

};

const ProtectedAddMovie = withAuth(AddMovie);
export default ProtectedAddMovie;