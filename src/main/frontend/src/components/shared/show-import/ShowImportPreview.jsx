import axios from "axios";
import "./ShowImportPreview.css";
import {Backdrop, CircularProgress} from "@mui/material";
import React, {useState} from "react";

const ShowBox = ({ id, name, image, type, onImport }) => {
    const [open, setOpen] = useState(false);
    const handleClick = async () => {
        setOpen(true);
        try {
            const response = await axios.get(`http://localhost:3333/api/${type.toLowerCase()}/importDetails/${id}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log(response.data);
            onImport(response.data);
        } catch (error) {
            console.error('Error fetching celebrity:', error);
        }
        setOpen(false);
    };

    const handleImageError = (e) => {
        e.target.src = "https://via.placeholder.com/100";
    }

    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className={"show-import-preview"} onClick={handleClick}>
                <div className={"show-import-preview-image"}>
                    <img src={image} alt={name} onError={handleImageError}/>
                </div>
                <div className={"show-import-preview-content"}>
                    <h3>{name}</h3>
                </div>
            </div>
        </div>
    );
};

export default ShowBox;