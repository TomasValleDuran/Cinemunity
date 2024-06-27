import ReactMarkdown from "react-markdown";
import {useNavigate} from "react-router-dom";

const Reply = ({reply_text, username, userId}) => {

    const navigate = useNavigate()

    const handleUserSearch = () => {
        navigate(`/user/${userId}`);
    }

    return (
        <div className="reply-container">
            <div className="reply-header">
                <h2 onClick={handleUserSearch} className="reply-username"> {username} </h2>
            </div>
            <div className="reply-body">
                <ReactMarkdown>{reply_text}</ReactMarkdown>
            </div>
        </div>
    )
}

export default Reply