import axios from "axios";
import "./CelebrityImportPreview.css";

const CelebrityBox = ({ id, name, image, onImport }) => {
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

    const handleImageError = (e) => {
        e.target.src = "https://via.placeholder.com/100";
    }

    return (
        <div className={"celebrity-preview"} onClick={handleClick}>
            <div className={"celebrity-preview-image"}>
                <img src={image} alt={name} onError={handleImageError}/>
            </div>
            <div className={"celebrity-preview-content"}>
                <h3>{name}</h3>
            </div>
        </div>
    );
};

export default CelebrityBox;