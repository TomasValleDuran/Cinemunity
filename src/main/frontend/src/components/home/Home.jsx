import React, {useEffect} from 'react';
import './Home.css';
import Header from '../shared/header/Header';
import axios from "axios";

import withAuth from '../hoc/withAuth';
import ShowPreviewCarrousel from "../shared/show-preview/ShowPreviewCarrousel";

const Home = () => {
    const [allMovies, setAllMovies] = React.useState([]);
    const [allTVShows, setAllTVShows] = React.useState([]);
    const [topRankedMovies, setTopRankedMovies] = React.useState([]);
    const [topRankedTVShows, setTopRankedTVShows] = React.useState([]);

    const fetchShows = async (endpoint) => {
        try {
            const response = await axios.get(`http://localhost:3333/api/show/${endpoint}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log(`${endpoint}:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return [];
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const movies = await fetchShows('getAllMovies');
            const tvShows = await fetchShows('getAllTVShows');
            const rankedMovies = await fetchShows('getTopRankedMovies');
            const rankedTVShows = await fetchShows('getTopRankedTVShows');

            setAllMovies(movies);
            setAllTVShows(tvShows);
            setTopRankedMovies(rankedMovies);
            setTopRankedTVShows(rankedTVShows);
        };

        fetchData();
    }, []);

    return (
        <div className="home-container">
            <Header/>
            <h1>Movies</h1>
            <ShowPreviewCarrousel posts={allMovies} slide={true}/>
            <h1>Tv Shows</h1>
            <ShowPreviewCarrousel posts={allTVShows} slide={true}/>
            <h1>Top 10 Movies</h1>
            <ShowPreviewCarrousel posts={topRankedMovies} slide={true}/>
            <h1>Top 10 Tv Shows</h1>
            <ShowPreviewCarrousel posts={topRankedTVShows} slide={true}/>
        </div>
    );
};

const ProtectedHome = withAuth(Home);
export default ProtectedHome;