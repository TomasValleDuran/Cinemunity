import React from 'react';
import './Home.css';
import Header from '../shared/header/Header';
import axios from "axios";
import {Link} from "react-router-dom";
import withAuth from '../hoc/withAuth';

const Home = () => {

    const[posts, setPosts] = React.useState([]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/show/getAll`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("shows:", response.data)
            return response.data;
        }
        catch (error) {
            console.error('Error fetching show:', error);
            return null;
        }
    }

    React.useEffect(() => {
        const fetchPostsData = async () => {
            const response = await fetchPosts();
            response && setPosts(response);
        };

        fetchPostsData();
    }, []);

    return (
        <div className="home-container">
            <Header />
            <h1>Shows</h1>
            <ul>
                {posts.map(post => <li key={post.title} >
                    <Link to={`/show/${post.title}`}>{post.title}</Link>
                </li>)}
            </ul>
        </div>
    );
};

const ProtectedHome = withAuth(Home);
export default ProtectedHome;