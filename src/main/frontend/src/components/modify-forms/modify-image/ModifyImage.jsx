import React, {useState} from 'react';
import { Button, Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import FileUploadButton from '../../shared/material-ui-stolen/FileUploadButton';
import './ModifyImage.css';

function ModifyImage({ type, folder, id, currentImage, onImageChange}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [open, setOpen] = useState(false);
    const [legalFile, setLegalFile] = useState(false);
    const [validFileMessage, setValidFileMessage] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if ((file && file.type.startsWith('image/'))) {
            setSelectedFile(file);
            setValidFileMessage(file.name);
            setPreviewUrl(URL.createObjectURL(file));
            setLegalFile(true);
        } else {
            console.error('Invalid file type, please select an image file.');
            setSelectedFile(null);
            setValidFileMessage("Invalid file type, please select an image file.");
            setPreviewUrl(null);
            setLegalFile(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setOpen(true);
        let newImageUrl = null;
        try {
            const data = {
                folder: `${folder}`,
                objectKey: selectedFile.name
            };
            const uploadResponse = await axios.post('http://localhost:3333/api/upload', data);
            const presignedUrl = uploadResponse.data.url;
            const fullObjectKey = uploadResponse.data.fullObjectKey;

            await axios.put(presignedUrl, selectedFile);
            console.log('Image uploaded successfully');

            const updateResponse = await axios.put(`http://localhost:3333/api/${type}/updateImage`, {
                id,
                fullObjectKey
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("Updated image successfully:", updateResponse.data)
            newImageUrl = updateResponse.data.image;

            const url = new URL(currentImage);
            const oldObjectKey = url.pathname.slice(1);
            console.log("Old object key:", oldObjectKey);
            axios.delete('http://localhost:3333/api/deleteImage', { // Don't await this promise
                data: { fullObjectKey: oldObjectKey },
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(() => {
                console.log("Deleted old image from s3 successfully");
            }).catch((error) => {
                console.error('Failed to delete the old image:', error);
            });
        } catch (error) {
            console.error('Failed to modify the image:', error);
        }
        setOpen(false);
        onImageChange(newImageUrl);
    };

    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <form className={"image-form-container"} onSubmit={handleSubmit}>
                <FileUploadButton onChange={handleFileChange}/>
                {!legalFile && <p className={"error-message"}>{validFileMessage}</p>}
                {previewUrl && <img className={"preview-image"} src={previewUrl} alt="Preview" />}
                <Button variant="contained" type="submit" color="primary"
                        disabled={!legalFile}>
                    Save
                </Button>
            </form>
        </div>
    );
}

export default ModifyImage;