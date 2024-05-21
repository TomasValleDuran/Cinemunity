import { useParams } from "react-router-dom";
import withAuth from "../hoc/withAuth";
import Header from "../shared/header/Header";
import "./UserList.css";
import React, {useEffect, useState} from "react";
import axios from "axios";
import UserPreviewCarousel from "../shared/user-preview/UserPreviewCarrousel";

const UserList = ({ listType }) => {
    const { userId } = useParams();
    const [posts, setPosts] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/user/${userId}/${listType}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("información de users:", response.data)
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            return null;
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <Header/>
            <div className={"user-list-container"}>
                <div className={"header"}>
                    <div className="title">
                        <div className="tittle-text">{listType === "following" ? "Following" : "Followers"}</div>
                    </div>
                </div>
                <UserPreviewCarousel posts={posts}/>
            </div>
        </div>
    );
};

const ProtectedUserList = withAuth(UserList);
export default ProtectedUserList;