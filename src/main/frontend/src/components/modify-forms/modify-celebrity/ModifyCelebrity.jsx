import React, { useState, useEffect } from 'react';
import axios from "axios";
import withAuth from "../../hoc/withAuth";
import { Backdrop, Button, CircularProgress, IconButton, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";


const ModifyCelebrity = () => {
    const { celebrityId } = useParams();
    const [celebrityName, setCelebrityName] = useState('');
    const [celebrityBio, setCelebrityBio] = useState('');
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const fetchCelebrity = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/celebrity/get/${celebrityId}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            setCelebrityName(response.data.name);
            setCelebrityBio(response.data.bio);
            console.log("Celebrity fetched successfully:", response.data);
        } catch (error) {
            console.error('Error fetching celebrity:', error);
            return null;
        }
    }

    useEffect(() => {
        fetchCelebrity();
    }, []);

    const handleCelebrityChange = (event) => {
        setCelebrityName(event.target.value);
    }

    const handleBiographyChange = (event) => {
        setCelebrityBio(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setOpen(true);
            const response = await axios.put('http://localhost:3333/api/celebrity/modify', {
                id: celebrityId,
                name: celebrityName,
                biography: celebrityBio,
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error(error.response.data, error);
        }
        setOpen(false);
        navigate(`/celebrity/${celebrityId}`)
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
                    <IconButton aria-label="back" onClick={() => navigate(`celebrity/${celebrityId}`)}>
                        <ArrowBackIcon/>
                    </IconButton>
                </div>
                <div className={"header"}>
                    <div className="title">
                        <div className="tittle-text">Modify Celebrity</div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className={"inputs"}>
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
                    <Button variant="contained" type="submit" color="primary">
                        Save
                    </Button>
                </form>
            </div>
        </div>
    );
};

const ProtectedModifyCelebrity = withAuth(ModifyCelebrity);
export default ProtectedModifyCelebrity;