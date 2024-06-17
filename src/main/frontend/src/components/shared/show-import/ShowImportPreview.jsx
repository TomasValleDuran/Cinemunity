import axios from "axios";
import "./ShowImportPreview.css";

const ShowBox = ({ id, name, image, type, onImport }) => {
    const handleClick = async () => {
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
    };

    const handleImageError = (e) => {
        e.target.src = "https://via.placeholder.com/100";
    }

    return (
        <div className={"show-import-preview"} onClick={handleClick}>
            <div className={"show-import-preview-image"}>
                <img src={image} alt={name} onError={handleImageError}/>
            </div>
            <div className={"show-import-preview-content"}>
                <h3>{name}</h3>
            </div>
        </div>
    );
};

export default ShowBox;