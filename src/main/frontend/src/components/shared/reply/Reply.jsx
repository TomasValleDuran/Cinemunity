import ReactMarkdown from "react-markdown";
import {useNavigate} from "react-router-dom";
import "./Reply.css"
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const Reply = ({ replyId, reply_text, username, userId, onRemoveReply}) => {

    const navigate = useNavigate()

    const handleUserSearch = () => {
        navigate(`/user/${userId}`);
    }

    const handleDelete = () => {
        axios.delete(`http://localhost:3333/api/review/deleteReply/:${replyId}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log(response.data);
                onRemoveReply();
            })
            .catch(error => {
                console.error('Error deleting review:', error);
            });
    };

    return (
        <div className="reply-container">
            <div className="reply-header">
                <h2 onClick={handleUserSearch} className="reply-username"> {username} </h2>
                <IconButton>
                    <DeleteIcon onClick={handleDelete}/>
                </IconButton>
            </div>
            <div className="reply-body">
                <ReactMarkdown>{reply_text}</ReactMarkdown>
            </div>
        </div>
    )
}

export default Reply