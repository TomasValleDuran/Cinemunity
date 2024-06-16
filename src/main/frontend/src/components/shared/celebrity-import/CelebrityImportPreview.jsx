import { Box, Typography } from "@mui/material";
import axios from "axios";

const CelebrityBox = ({ id, name, department, movieNames, onImport }) => {
    const handleClick = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/celebrity/importDetails/${id}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log(response.data);
            onImport(response.data);
        } catch (error) {
            console.error('Error fetching celebrity:', error);
        }
    };

    return (
        <Box sx={{ border: '1px solid black', margin: '10px', padding: '10px' }} onClick={handleClick}>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="subtitle1">{department} • {movieNames.join(', ')}</Typography>
        </Box>
    );
};

export default CelebrityBox;