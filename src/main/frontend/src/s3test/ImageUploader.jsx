import React, { useState } from 'react';
import axios from 'axios';

function ImageUploader() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
        } else {
            console.error('Invalid file type, please select an image file.');
            setSelectedFile(null); // Reset selected file
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            console.error('No file selected');
            return;
        }

        // Get the file name
        const fileName = selectedFile.name;

        // Create a JSON object with the folder and objectKey
        const data = {
            folder: 'Shows/',
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
            const presignedUrl = response.data;
            console.log(presignedUrl)

            // Upload the file to S3
            await axios.put(presignedUrl, selectedFile);

            console.log('File uploaded successfully');

            setImageUrl(presignedUrl);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange}/>
                <button type="submit">Upload</button>
            </form>

            {imageUrl && <img src={imageUrl} alt="Uploaded" />}
        </div>
    );
}

export default ImageUploader;