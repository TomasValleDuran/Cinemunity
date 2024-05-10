import React, {useEffect, useState} from 'react';
import axios from "axios";
import './AddMovie.css';
import withAuth from "../../hoc/withAuth";
import {useNavigate} from "react-router-dom";
import FileUploadButton from '../../shared/material-ui-stolen/FileUploadButton';
import {Backdrop, Button, CircularProgress, IconButton, TextField} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        let fullObjectKey = '';
        setOpen(true);
        try {
            const fileName = selectedFile.name;
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
            fullObjectKey = urlPackage.data.fullObjectKey;

            await axios.put(presignedUrl, selectedFile);
            console.log('File uploaded successfully');

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
            console.log("res")
            console.log(response.data)
            setTitle('');
            setDescription('');
            setDirector('');
            setActorList([]);
            setSeasons('');
            setPreviewUrl(null);
            setErrorMessage('');
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
        }
        setOpen(false);
    };

    const handleSelect = (event) => {
        setShowType(event.target.value);
    };

    const handleAddActor = async () => {
        if (Actor === '') {
            console.log('Input is empty. Please enter an actor name.');
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

    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="container">
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
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <select value={showType} onChange={handleSelect} className="form-control">
                                <option value="Movie">Movie</option>
                                <option value="TVShow">TV Show</option>
                            </select>
                        </div>
                        {showType === 'TVShow' && (
                            <TextField
                                type={"number"}
                                label={"Seasons"}
                                value={Seasons}
                                required={true}
                                onChange={handleSeasonChange}
                            />
                        )}
                        <TextField
                            type="title"
                            label="Title"
                            value={Title}
                            required={true}
                            onChange={handleTitleChange}
                        />
                        <TextField
                            type="description"
                            label="Description"
                            multiline={true}
                            value={Description}
                            required={true}
                            onChange={handleDescriptionChange}/>
                        <TextField
                            type="director"
                            label="Director"
                            value={Director}
                            required={true}
                            onChange={handleDirectorChange}
                        />
                        <div className={"add-actor-package"}>
                            <TextField
                                type="actor"
                                label="Actor"
                                value={Actor}
                                variant="outlined"
                                onChange={handleActorChange}
                            />
                            <Button
                                variant="contained"
                                size="medium"
                                onClick={handleAddActor}>
                                Add
                            </Button>
                        </div>
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
                        <FileUploadButton onChange={handleFileChange}/>
                        {previewUrl && <img className={"preview-image"} src={previewUrl} alt="Preview"/>}
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        <Button variant="contained" type="submit" color="primary"
                                disabled={!(legalFile && Title && Description && Director && ActorList.length > 0)}>
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